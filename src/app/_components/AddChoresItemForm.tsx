"use client";

import * as z from "zod";
import GenericForm from "@/app/_components/form/GenericForm";
import Inputfield from "@/app/_components/form/InputField";
import Button from "@/app/_components/Button";
import FormItem from "@/app/_components/form/FormItem";
import FormLabel from "@/app/_components/form/FormLabel";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface iAddItemFormProps {
  listId: string | null;
}


export default function AddChoresItemForm({ listId }: { listId: string | undefined }) {
  /** As the api mutation in this Component is interacting with a Page (Server Component)
   * we need to use `router.refresh()` to invaliadate the cached data in the Page (Server Component).
   * If the cache data is in a "use client" component then we can use `api.useUtils()` hook instead.
   * further reading here: https://trpc.io/docs/client/react/useUtils
   */
  const router = useRouter();

  const { mutate } = api.choresItem.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  // schema definition can be kept here as its the same for chores
  const formSchema = z.object({
    name: z.string().min(1, { message: "A chore is required" })
  });

  // uses the schema and mutate funnction setup above
  function handleSubmit(data: z.infer<typeof formSchema>) {
    if (listId === undefined) {
      return;
    }
    mutate({ ...data, listId });
  }

  return (
    <GenericForm
      formSchema={formSchema}
      handleSubmit={handleSubmit}
      className="w-full"
    >
      <FormItem>
        <FormLabel fieldName={"title"}>Create a new chores item</FormLabel>
        <Inputfield
          fieldName="name"
          placeholder="Enter a chore..."
          className="w-full"
          data-cy="choresItem-create-input"
        />
      </FormItem>
      <FormItem className="flex justify-end col-span-2">
        <Button type="submit" className="w-20" data-cy="choresItem-create-submit">
          Submit
        </Button>
      </FormItem>
    </GenericForm>
  );
}