"use client";

import React from "react";
import { cn } from "@/app/utils/cn";

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function FormItem({
  className,
  children,
  ...rest
}: FormItemProps) {
  return (
    <div className={cn("space-y-2text-base", className)} {...rest}>
      {children}
    </div>
  );
}
