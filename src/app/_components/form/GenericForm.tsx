"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/app/utils/cn";
import type { z, ZodType } from "zod";

export default function GenericForm({
  children,
  formSchema,
  className,
  handleSubmit,
}: {
  children: React.ReactNode;
  formSchema: ZodType;
  className?: string;
  handleSubmit: (data: z.infer<typeof formSchema>) => void;
}) {
  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // takes the passed in handleSubmit function and calls it with the data from the form
  function onSubmit(data: z.infer<typeof formSchema>) {
    handleSubmit(data);
  }

  return (
    <FormProvider {...methods}>
      <div>{methods.formState.errors.root?.message}</div>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn("space-y-2", className)}
      >
        {children}
      </form>
    </FormProvider>
  );
}
