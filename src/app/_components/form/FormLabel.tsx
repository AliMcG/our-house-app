"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/app/utils/cn";

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  fieldName: string;
}

export default function FormLabel({
  className,
  children,
  fieldName,
  ...rest
}: FormLabelProps) {
  const { getFieldState } = useFormContext();
  const filedState = getFieldState(fieldName);

  return (
    <label
      className={cn("text-base", filedState.error && "text-red-700", className)}
      {...rest}
    >
      {children}
    </label>
  );
}
