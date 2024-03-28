"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


const schema = z.object({
  item: z.string().min(3, { message: 'Too short' }).max(96, { message: 'Too long' })
});

export default function AddItemForm(): JSX.Element {
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });
  const { errors } = methods.formState;

  // just a place holder until it is passed in as a prop
  function onSubmit(data) {
    console.log("FORM DATA: ", data);
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <input type="text" placeholder="enter item to add" {...methods.register("item")} />
          {errors.item?.message && <p>{errors.item?.message}</p>}
          <input type="submit" />
        </form>
      </FormProvider>
    </div>
  );
}

