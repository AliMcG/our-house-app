"use client";

import * as z from "zod";
import GenericForm from "@/app/_components/form/GenericForm";
import Inputfield from "@/app/_components/form/InputField";
import Button from "@/app/_components/Button";
import FormItem from "@/app/_components/form/FormItem";
import FormLabel from "@/app/_components/form/FormLabel";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";


export default function AddShoppingListForm() {
  /** As the api mutation in this Component is interacting with a Page (Server Component)
   * we need to use `router.refresh()` to invaliadate the cached data in the Page (Server Component).
   * If the cache data is in a "use client" component then we can use `api.useUtils()` hook instead.
   * further reading here: https://trpc.io/docs/client/react/useUtils
   */
  const router = useRouter();

  const { mutate } = api.shoppingList.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  // schema definition can be kept here as its the same for shopping list and chores list
  const formSchema = z.object({
    title: z.string().min(1, { message: "Name is required" }),
  });

  // uses the schema and mutate funnction setup above
  function handleSubmit(data: z.infer<typeof formSchema>) {
    mutate(data);
  }

  return (
    <GenericForm formSchema={formSchema} handleSubmit={handleSubmit}>
      <FormItem>
        <FormLabel fieldName={"title"}>Create a new list</FormLabel>
        <Inputfield
          fieldName={"title"}
          placeholder="Enter a name..."
          className="w-40"
          data-cy="shoppinglist-create-input"
        />
      </FormItem>
      <FormItem className="flex justify-end">
        <Button type="submit" className="w-20" data-cy="shoppinglist-create-submit">
          Submit
        </Button>
      </FormItem>
    </GenericForm>
  );
}

