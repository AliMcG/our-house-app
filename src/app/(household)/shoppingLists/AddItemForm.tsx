"use client";

import * as z from "zod";
import GenericForm from "@/app/_components/GenericForm";


const schema = z.object({
  item: z.string().min(3, { message: 'Too short' }).max(96, { message: 'Too long' })
});

export default function AddItemForm():JSX.Element {
  function handleSubmit(data: z.infer<typeof schema>) {
    console.log("SUBMITTING ITEM TO ADD: ", data);
  }

  return (
    <div>
      <GenericForm schema={schema} handleSubmit={handleSubmit} />
    </div>
  )
}