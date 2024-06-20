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
  listID: string | null;
}


export default function AddShoppingItemForm(params: iAddItemFormProps) {
  /** As the api mutation in this Component is interacting with a Page (Server Component)
   * we need to use `router.refresh()` to invaliadate the cached data in the Page (Server Component).
   * If the cache data is in a "use client" component then we can use `api.useUtils()` hook instead.
   * further reading here: https://trpc.io/docs/client/react/useUtils
   */
  const router = useRouter();
  const { listID } = params;

  const { mutate } = api.shoppingListItem.create.useMutation({
    onSuccess: (response) => {
      console.log('CREATED', response);
      router.refresh();
    },
  });

  // schema definition can be kept here as its the same for shopping list and chores list
  // we could pass in more specific schema as a props if needed
  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    quantity: z.coerce.number().int().min(1).max(99, { message: "Quantity must be less than 100" }).default(1).catch(1),
  });

  // uses the schema and mutate funnction setup above
  function handleSubmit(data: z.infer<typeof formSchema>) {
    if (listID === null) {
      console.error("List ID is null, cannot add item");
      return;
    }
    console.log("SUBMITTING ITEM TO ADD: ", data);
    mutate({ ...data, listID });
  }

  return (
    <GenericForm 
      formSchema={formSchema} 
      handleSubmit={handleSubmit}
      className="grid gap-2 grid-cols-[70%_30%] grid-rows-2 w-full"
    >
      <FormItem>
        <FormLabel fieldName={"title"}>Create a new item</FormLabel>
        <Inputfield
          fieldName="name"
          placeholder="Enter a name..."
          className="w-full"
        />
      </FormItem>
      <FormItem className="!my-0">
        <FormLabel fieldName={"title"}>Quantity</FormLabel>
        <Inputfield
          fieldName="quantity"
          placeholder="1"
          className="w-full"
          type="number"
          max="99"
          min="1"
        />
      </FormItem>
      <FormItem className="flex justify-end col-span-2">
        <Button type="submit" className="w-20">
          Submit
        </Button>
      </FormItem>
    </GenericForm>
  );
}