"use client";

import * as z from "zod";
import GenericForm from "@/app/_components/form/GenericForm";
import Inputfield from "@/app/_components/form/InputField";
import Button from "@/app/_components/Button";
import FormItem from "@/app/_components/form/FormItem";
import FormLabel from "@/app/_components/form/FormLabel";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function EditHouseHoldForm() {
  /** As the api mutation in this Component is interacting with a Page (Server Component)
   * we need to use `router.refresh()` to invaliadate the cached data in the Page (Server Component).
   * If the cache data is in a "use client" component then we can use `api.useUtils()` hook instead.
   * further reading here: https://trpc.io/docs/client/react/useUtils
   */
  const router = useRouter();

  // Using the apiName to determine which api to use dynamically.
  const { mutate } = api.householdRouter.updateHouseholdMembers.useMutation({
    onSuccess: (response) => {
      console.log("Edited Household: ", response);
      router.refresh();
    },
  });

  // schema definition for Household input
  const formSchema = z.object({
    userEmail: z.string().email(),
    householdId: z.string()
  });

  // uses the schema and mutate funnction setup above
  function handleSubmit(data: z.infer<typeof formSchema>) {
    mutate(data);
  }

  return (
    <GenericForm formSchema={formSchema} handleSubmit={handleSubmit}>
      <FormItem>
        <FormLabel fieldName={"userEmail"}>Edit household</FormLabel>
        <Inputfield
          fieldName={"userEmail"}
          placeholder="Enter a email..."
          className="w-40"
          data-cy="household-edit-input"
        />
      </FormItem>
      <Inputfield
          fieldName={"householdId"}
          placeholder="Enter an id..."
          className="w-40"
          data-cy="household-edit-input"
        />
      <FormItem className="flex justify-end">
        <Button
          type="submit"
          className="w-20"
          data-cy="household-edit-submit"
        >
          Submit
        </Button>
      </FormItem>
    </GenericForm>
  );
}
