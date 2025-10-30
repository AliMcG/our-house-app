"use client";

import * as z from "zod";
import Button from "@/app/_components/Button";
import FormItem from "@/app/_components/form/FormItem";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Select from 'react-select'
import { useForm, Controller } from "react-hook-form"

export default function DeleteHouseHoldForm() {
  /** As the api mutation in this Component is interacting with a Page (Server Component)
   * we need to use `router.refresh()` to invaliadate the cached data in the Page (Server Component).
   * If the cache data is in a "use client" component then we can use `api.useUtils()` hook instead.
   * further reading here: https://trpc.io/docs/client/react/useUtils
   */
  const router = useRouter();
  const { data: listOfHouseHolds } = api.householdRouter.list.useQuery();


  // Using the apiName to determine which api to use dynamically.
  const { mutate } = api.householdRouter.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      setError("householdId", {
        type: "test",
        message: error.shape?.message
      })
    }
  });

  // schema definition for Household input
  const formSchema = z.object({
    householdId: z.string()
  });
  const { handleSubmit, control, setError, formState: { errors} } = useForm<z.infer<typeof formSchema>>()

  // uses the schema and mutate funnction setup above
  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data);
  }

  const selectOptions = listOfHouseHolds?.map((household) => {
    return { value: household.id, label: household.name}
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-slate-600 p-4 rounded-md">
       <label >Delete a household</label>
      <Controller 
        control={control}
        name="householdId"
        render={({ field: { onChange, name } }) => (
          <Select name={name} options={selectOptions} onChange={val => onChange(val?.value)}/>
        )}
      />
      {errors.householdId && <p className="text-red-600 p-2">{errors.householdId.message}</p>}
      <FormItem className="flex justify-end">
        <Button
          type="submit"
          className="w-20"
          data-cy="household-delete-submit"
        >
          Submit
        </Button>
      </FormItem>
    </form>
  );
}
