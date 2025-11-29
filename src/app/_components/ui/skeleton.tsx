import { cn } from "@/app/utils/cn";
import { props } from "node_modules/cypress/types/bluebird";
import React, { ComponentProps } from 'react';


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
      className={cn("flex flex-col place-content-center gap-2 w-full p-4 border border-gray-300 rounded-md animate-pulse", className)}
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

/* App Logo: custom skeleton shaped as the app logo
  - takes in optional loading message to go below the logo or use "loading content..."
 */
type SkeletonLogoProps = React.ComponentProps<"div"> & {
  loadingMsg?: String;
}

Skeleton.Logo = function SkeletonLogo({
  className,
  loadingMsg = "loading content...",
  ...props
}: SkeletonLogoProps) {
  return (
    <div className="grid size-full place-content-center p-8">
      <div className="flex flex-col place-items-center max-w-[240px] border-0 ">
        {/* wraps the roof and walls */}
        <div className="grid grid-cols-1 grid-rows-[60px_100px] w-[160px] h-[150px]">
          <div className="justify-self-center">
            <div className="w-[0px] h-[0px] border-x-[80px] border-b-[60px] border-solid border-x-transparent border-b-gray-200 animate-pulse"></div>
          </div>
          <div className="grid w-[120px] h-[90px] justify-self-center border-[2px] border-gray-100">
            <div className="grid grid-cols-3 grid-rows-3 place-items-center animate-pulse">
              <div className="w-[20px] h-[20px] bg-gray-200"></div>
              <div className="w-[20px] h-[20px] bg-gray-200"></div>
              <div className="w-[20px] h-[20px] rounded-full bg-gray-200"></div>
              <div className="w-[20px] h-[20px] rounded-full bg-gray-200"></div>
              <div className="w-[20px] h-[20px] bg-gray-200"></div>
              <div className="w-[20px] h-[20px] bg-gray-200"></div>
              <div className="w-[20px] h-[20px] bg-gray-200"></div>
              <div className="w-[20px] h-[20px] rounded-full bg-gray-200"></div>
              <div className="w-[20px] h-[20px] bg-gray-200"></div>
            </div>
          </div>
        </div>
        {/* loading message */}
        <p className="text-center text-gray-300">{loadingMsg}</p>
      </div>
    </div>
  )
}
