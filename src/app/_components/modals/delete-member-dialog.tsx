"use client";

import { useState } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { UserPlus, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import FormItem from "../form/FormItem";
import FormLabel from "../form/FormLabel";
import GenericForm from "../form/GenericForm";
import Inputfield from "../form/InputField";
import { useSession } from "next-auth/react";

export function DeleteMemberDialog({
  householdId,
  userToDeleteId,
  userToDeleteName,
}: {
  householdId: string;
  userToDeleteId: string;
  userToDeleteName: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: sessionData } = useSession();

  // Using the apiName to determine which api to use dynamically.
  const { mutate } =
    api.householdUserRouter.deleteUserFromHousehold.useMutation({
      onSuccess: () => {
        router.refresh();
        setLoading(false);
        setOpen(false);
      },
    });

  // schema definition for Household input
  const formSchema = z.object({
    userToDeleteName: z.string().optional(),
})
.refine((data) => {
  // This refine function runs after the initial schema validation.
  // If the input is disabled, we don't care if it's empty.
  // If it's NOT disabled, then it must be a string with at least one character.
  // We can infer the 'disabled' state by checking if userToDeleteName is undefined.
  // If it's undefined, we assume it's disabled and its value was never intended to be submitted.
  if (data.userToDeleteName === undefined) {
    return true; // It's optional and not provided, so it's valid.
  }
  // If userToDeleteName is provided, then it must not be empty.
  return data.userToDeleteName.length > 0;
}, {
  message: "User name to delete is required", // This message will be shown if the refine fails
  path: ["userToDeleteName"], // Associate the error with the specific field
});
  

  function handleSubmit(data: z.infer<typeof formSchema>) {
    const fullData = {
      ...data,
      householdId,
      userToDeleteId,
    };
    mutate(fullData);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Delete Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center semibold">
            Delete <span className="bold">{userToDeleteName}</span> from household
          </DialogTitle>
          <DialogDescription>
            This action will delete {userToDeleteName} from your household. It
            will also remove any shared shopping lists and items associated with
            them. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <GenericForm
          formSchema={formSchema}
          handleSubmit={handleSubmit}
          className="space-y-4"
        >
          <FormItem>
            <FormLabel fieldName={"userToDeleteName"}>
              User name to delete
            </FormLabel>
            <Inputfield
              fieldName={"userToDeleteName"}
              placeholder="member@example.com"
              data-cy="delete-member-input"
              value={userToDeleteName}
              disabled
            />
          </FormItem>
          <FormItem className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" data-cy="delete-member-submit">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Member"
              )}
            </Button>
          </FormItem>
        </GenericForm>
      </DialogContent>
    </Dialog>
  );
}
