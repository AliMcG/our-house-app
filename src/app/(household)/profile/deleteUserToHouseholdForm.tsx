"use client";

import * as z from "zod";
import Button from "@/app/_components/Button";
import FormItem from "@/app/_components/form/FormItem";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";

export default function DeleteUserToHouseHoldForm() {
  /** As the api mutation in this Component is interacting with a Page (Server Component)
   * we need to use `router.refresh()` to invalidate the cached data in the Page (Server Component).
   * If the cache data is in a "use client" component then we can use `api.useUtils()` hook instead.
   * further reading here: https://trpc.io/docs/client/react/useUtils
   */
  const router = useRouter();
  const { data: listOfHouseHolds } = api.householdRouter.list.useQuery();

  const { mutate } =
    api.householdUserRouter.deleteUserFromHousehold.useMutation({
      onSuccess: () => {
        router.refresh();
      },
      onError: (error) => {
        setError("userEmail", {
          type: "test",
          message: error.shape?.message,
        });
      },
    });

  const formSchema = z.object({
    userEmail: z.string().email(),
    householdId: z.string(),
  });
  const {
    handleSubmit,
    control,
    register,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>();

  /**
   * Not implemented as the method has been changed in the router. See mutation `deleteUserFromHousehold` in householdUserRouter.ts
   */
  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Deleting user from household with data:", data);
  }

  const selectOptions = listOfHouseHolds?.map((household) => {
    return { value: household.id, label: household.name };
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-md border border-slate-600 p-4"
    >
      <FormItem>
        <label>Delete a user from household</label>
        <input
          {...register("userEmail")}
          placeholder="Enter a email..."
          className="flex h-10 w-full rounded-md border border-input px-3 py-3 text-sm file:border-0 file:bg-transparent file:font-medium placeholder:text-slate-400"
          data-cy="household-delete-input"
        />
        {errors.userEmail && (
          <p className="p-2 text-red-600">{errors.userEmail.message}</p>
        )}
      </FormItem>
      <Controller
        control={control}
        name="householdId"
        render={({ field: { onChange, name } }) => (
          <Select
            name={name}
            options={selectOptions}
            onChange={(val) => onChange(val?.value)}
          />
        )}
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
