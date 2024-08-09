"use client"
import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/app/utils/cn";

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldName: string;
}

export default function Inputfield({
  fieldName,
  type,
  className,
  ...rest
}: InputFieldProps) {
  const { register, getFieldState } = useFormContext();
  const fieldState = getFieldState(fieldName);

  return (
    <>
      <input
        {...register(fieldName)}
        type={type}
        className={cn(
          "border-input flex h-10 w-full rounded-md border px-3 py-3 text-sm file:border-0 file:bg-transparent file:font-medium placeholder:text-slate-400",
          className,
        )}
        {...rest}
      />
      <p className="text-red-700">{fieldState.error?.message?.toString()}</p>
    </>
  );
}
