'use client'

import { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import { UserPlus, Loader2, Mail } from 'lucide-react'
import { api } from "@/trpc/react"
import { useRouter } from "next/navigation"
import * as z from "zod"
import FormItem from '../form/FormItem'
import FormLabel from '../form/FormLabel'
import GenericForm from '../form/GenericForm'
import Inputfield from '../form/InputField'
import { useSession } from 'next-auth/react'


export function InviteMemberDialog({ householdId }: { householdId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const { data: sessionData } = useSession();
  

  // Using the apiName to determine which api to use dynamically.
  const { mutate } = api.householdUserRouter.inviteToHousehold.useMutation({
    onSuccess: () => {
      router.refresh();
      setLoading(false);
      setOpen(false);
    },
  });

  // schema definition for Household input
  const formSchema = z.object({
    invitedEmail: z.string().email().min(1, { message: "Email address is required" }),
    invitedName: z.string().min(1, { message: "Name is required" }),

  });


  function handleSubmit(data: z.infer<typeof formSchema>) {
    const fullData = { ...data, householdId, senderName: sessionData?.user.name || 'Household owner' };
    mutate(fullData);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Invite New Member
          </DialogTitle>
          <DialogDescription>
            Send an email invitation to add a new member to your household.
          </DialogDescription>
        </DialogHeader>
        <GenericForm formSchema={formSchema} handleSubmit={handleSubmit} className="space-y-4">
          <FormItem>
            <FormLabel fieldName={"invitedEmail"}>Email Address to invite</FormLabel>
            <Inputfield
              fieldName={"invitedEmail"}

              placeholder="member@example.com"
              data-cy="household-invite-input"
            />
          </FormItem>
          <FormItem>
            <FormLabel fieldName={"invitedName"}>Full Name to invite</FormLabel>
            <Inputfield
              fieldName={"invitedName"}
              placeholder="John Doe"
              data-cy="household-invite-input"
            />
          </FormItem>
          <FormItem className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              data-cy="household-invite-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending invite...
                </>
              ) : (
                'Send invite'
              )}
            </Button>
          </FormItem>
        </GenericForm>
      </DialogContent>
    </Dialog>
  )
}