'use client'

import { Button } from '@/app/_components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import { api } from "@/trpc/react"
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useState } from 'react'
import * as z from "zod"
import FormItem from '../form/FormItem'
import FormLabel from '../form/FormLabel'
import GenericForm from '../form/GenericForm'
import Inputfield from '../form/InputField'


export function CreateHouseholdDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  // Using the apiName to determine which api to use dynamically.
  const { mutate } = api.householdRouter.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setLoading(false);
      setOpen(false);
    },
  });

  // schema definition for Household input
  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
  });

  // uses the schema and mutate funnction setup above
  function handleSubmit(data: z.infer<typeof formSchema>) {
    mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Household
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] gap-2">
        <DialogHeader>
          <DialogTitle>Create New Household</DialogTitle>
          <DialogDescription>
            Create a new household to share lists, tasks, and events with family members.
          </DialogDescription>
        </DialogHeader>
        <GenericForm formSchema={formSchema} handleSubmit={handleSubmit} className="space-y-4">
          <FormItem>
            <FormLabel fieldName={"name"}>Household Name</FormLabel>
            <Inputfield
              fieldName={"name"}
              placeholder="e.g., Smith Family, Apartment 4B"
              data-cy="household-create-input"
            />
          </FormItem>
          <FormItem className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              data-cy="household-create-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Household'
              )}
            </Button>
          </FormItem>
        </GenericForm>
      </DialogContent>
    </Dialog>
  )
}