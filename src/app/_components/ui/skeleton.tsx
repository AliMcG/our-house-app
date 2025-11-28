import { cn } from "@/app/utils/cn";
import { props } from "node_modules/cypress/types/bluebird";
import React from 'react';


/*
  - Uses a compositional approach as skeletons are UI placeholders not Semantic UI elements
  - as visual placeholders a `forwardRef` is not required
  - no content or layout logic
  - focused on shape + animation
*/
export function Skeleton({ className, children, ...props}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton-group"
      className={cn("flex flex-col place-content-center gap-2 p-4 border border-gray-300 rounded-md animate-pulse", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// shared skeleton styles
const base = "bg-gray-200 rounded-md"

/* Componsitional Variants */

// Text: defaults to full width of container with round edges
Skeleton.Text = function SkeletonText({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(base, "h-2 w-full", className)}
      {...props}
    />
  )
}

// Image: defaults to 80px by 80px square with round edges
Skeleton.Image = function SkeletonImage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(base, "h-[80px] w-[80px]", className)}
      {...props}
    />
  )
}

// Button: defaults to 60px by 120px rectangle with round edges
Skeleton.Button = function SkeletonButton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(base, "h-[40px] w-[120px]", className)}
      {...props}
    />
  )
}

// Circle: defaults to a 80px by 80px
Skeleton.Circle = function SkeletonCircle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(base, "h-[80px] w-[80px] rounded-full", className)}
      {...props}
    />
  )
}