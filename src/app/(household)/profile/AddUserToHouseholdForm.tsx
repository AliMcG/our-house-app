"use client";

import * as z from "zod";
import GenericForm from "@/app/_components/form/GenericForm";
import Inputfield from "@/app/_components/form/InputField";
import Button from "@/app/_components/Button";
import FormItem from "@/app/_components/form/FormItem";
import FormLabel from "@/app/_components/form/FormLabel";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Select, { type SingleValue } from 'react-select'
import { useForm, Controller } from "react-hook-form"

export default function AddUserToHouseHoldForm() {
  /** As the api mutation in this Component is interacting with a Page (Server Component)
   * we need to use `router.refresh()` to invaliadate the cached data in the Page (Server Component).
   * If the cache data is in a "use client" component then we can use `api.useUtils()` hook instead.
   * further reading here: https://trpc.io/docs/client/react/useUtils
   */
  const router = useRouter();
  const { data: listOfHouseHolds } = api.householdRouter.list.useQuery();


  // Using the apiName to determine which api to use dynamically.
  const { mutate } = api.householdRouter.updateHouseholdMembers.useMutation({
    onSuccess: (response) => {
      console.log("Edited Household: ", response);
      // if (response?.status === "error" )
      router.refresh();
    },
    onError: (error) => {
      console.log("create error", error.data?.zodError?.fieldErrors)
      // setError(error.data)
    }
  });

  // schema definition for Household input
  const formSchema = z.object({
    userEmail: z.string().email(),
    householdId: z.string()
  });
  const { handleSubmit, control, register, setError } = useForm<z.infer<typeof formSchema>>()

  // uses the schema and mutate funnction setup above
  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data);
  }

  const selectOptions = listOfHouseHolds?.map((household) => {
    return { value: household.id, label: household.name}
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-slate-600 p-4 rounded-md">
      <FormItem>
        <label >Add a user to  household</label>
        <input
          {...register("userEmail")}
          placeholder="Enter a email..."
          className="border-input flex h-10 w-full rounded-md border px-3 py-3 text-sm file:border-0 file:bg-transparent file:font-medium placeholder:text-slate-400"
          data-cy="household-edit-input"
        />
      </FormItem>
      <Controller 
        control={control}
        name="householdId"
        render={({ field: { onChange, name } }) => (
          <Select name={name} options={selectOptions} onChange={val => onChange(val?.value)}/>
        )}
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
    </form>
  );
}
