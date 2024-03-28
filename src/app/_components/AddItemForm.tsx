"use client";

import { useForm, FormProvider, useFormContext } from "react-hook-form";


export default function AddItemForm(): JSX.Element {
  const methods = useForm()

  // just a place holder until it is passed in as a prop
  function onSubmit(data) {
    console.log("FORM DATA: ", data);
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormInput />
          <input type="submit" />
        </form>
      </FormProvider>
    </div>
  );
}

function FormInput() {
  const { register } = useFormContext();
  return <input type="text" placeholder="enter item to add" {...register("item")} />;
}
