"use client";

import * as z from "zod";
import Button from "@/app/_components/Button";
import FormItem from "@/app/_components/form/FormItem";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Select from 'react-select'
import { useForm, Controller } from "react-hook-form"

export default function EditHouseHoldForm() {
  /** As the api mutation in this Component is interacting with a Page (Server Component)
   * we need to use `router.refresh()` to invaliadate the cached data in the Page (Server Component).
   * If the cache data is in a "use client" component then we can use `api.useUtils()` hook instead.
   * further reading here: https://trpc.io/docs/client/react/useUtils
   */
  const router = useRouter();
  const { data: listOfHouseHolds } = api.householdRouter.list.useQuery();


  // Using the apiName to determine which api to use dynamically.
  const { mutate } = api.householdRouter.edit.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (error) => {
      setError("name", {
        type: "test",
        message: error.shape?.message
      })
    }
  });

  const formSchema = z.object({
    householdId: z.string(),
    name: z.string().min(1)
  });
  const { handleSubmit, control, register, setError, formState: { errors } } = useForm<z.infer<typeof formSchema>>()

  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data);
  }

  const selectOptions = listOfHouseHolds?.map((household) => {
    return { value: household.id, label: household.name }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="border border-slate-600 p-4 rounded-md">
      <label >Edit a household</label>
      <Controller
        control={control}
        name="householdId"
        render={({ field: { onChange, name } }) => (
          <Select name={name} options={selectOptions} onChange={val => onChange(val?.value)} />
        )}
      />
      {errors.householdId && <p className="text-red-600 p-2">{errors.householdId.message}</p>}
      <p>Edit name:</p>
      <input
        {...register("name")}
        className="focus:ring-primary-500 focus:border-primary-500 mb-4 block w-80 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm"
        type="text"
        autoFocus
        data-cy="confirmModal-edit-input"
      />
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
