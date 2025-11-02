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

export function CreateShoppingListDialog({ householdId }: { householdId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const { mutate } = api.shoppingList.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setLoading(false);
      setOpen(false);
    },
  });

  // schema definition for ShoppingList input
  const formSchema = z.object({
    title: z.string().min(1, { message: "Name is required" }),
  });

  // uses the schema and mutate funnction setup above
  function handleSubmit(data: z.infer<typeof formSchema>) {
    const mutationData = {
      ...data,
      householdId: householdId,
    };
    mutate(mutationData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create ShoppingList
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] gap-2">
        <DialogHeader>
          <DialogTitle>Create New ShoppingList</DialogTitle>
          <DialogDescription>
            Create a new ShoppingList to share.
          </DialogDescription>
        </DialogHeader>
        <GenericForm formSchema={formSchema} handleSubmit={handleSubmit} className="space-y-4">
          <FormItem>
            <FormLabel fieldName={"title"}>Shopping List Name</FormLabel>
            <Inputfield
              fieldName={"title"}
              placeholder="e.g., Tesco's..."
              data-cy="shoppinglist-create-input"
            />
          </FormItem>
          <FormItem className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              data-cy="shoppinglist-create-submit"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create ShoppingList'
              )}
            </Button>
          </FormItem>
        </GenericForm>
      </DialogContent>
    </Dialog>
  )
}