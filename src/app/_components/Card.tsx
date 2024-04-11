import * as React from "react";
import { cn } from "@/app/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={cn("flex flex-col w-80 justify-center items-center border-gray-400 border rounded-md p-4", className)} {...rest}>
      {children}
    </div>
  );
}
