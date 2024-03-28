"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z, ZodType } from "zod";


export default function GenericForm({ 
  schema, 
  handleSubmit 
}: {
  // children: React.ReactNode;
  handleSubmit: (data: z.infer<typeof schema>) => void;
  schema: ZodType;
}): JSX.Element {

  // TODO: the schema not available to infer the type so the errors.items?.message gets a type error
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });
  const { errors } = methods.formState;

  // takes the passed in handleSubmit function and calls it with the data from the form
  function onSubmit(data: z.infer<typeof schema>) {
    handleSubmit(data);
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

