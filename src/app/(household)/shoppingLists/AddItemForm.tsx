"use client";

import * as z from "zod";
import GenericForm from "@/app/_components/form/GenericForm";
import Inputfield from "@/app/_components/form/InputFiled";
import Button from "@/app/_components/Button";
import FormItem from "@/app/_components/form/FormItem";
import FormLabel from "@/app/_components/form/FormLabel";

export default function AddItemForm() {
  const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
  });
  function handleSubmit(data: z.infer<typeof formSchema>) {
    console.log("SUBMITTING ITEM TO ADD: ", data);
  }

  return (
    <GenericForm
      formSchema={formSchema}
      handleSubmit={handleSubmit}
      className="flex flex-col w-80 justify-center items-center border-gray-400 border rounded-md p-4"
    >
      <FormItem>
        <FormLabel fieldName={"name"}>Shopping list name</FormLabel>
        <Inputfield
          fieldName={"name"}
          placeholder="Enter a name..."
          className="w-40"
        />
      </FormItem>
      <FormItem className="flex justify-end">
        <Button type="submit" className="w-20">
          Submit
        </Button>
      </FormItem>
    </GenericForm>
  );
}
