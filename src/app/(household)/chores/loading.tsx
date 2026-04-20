import { Skeleton } from "@/app/_components/ui/skeleton"


/* Custom skeleton for the Shopping list (landing page) loader */
export default function loading() {
  return (
    <div className="flex flex-col size-full bg-white gap-4">

      {/* Creation card */}
      <Skeleton className="sm:w-[280px] h-[120px] md:h-[160px] self-center">
        <Skeleton.Text className="md:h-4" />
        <Skeleton.Text className="h-6 md:h-8" />
        <Skeleton.Button className="self-end" />
      </Skeleton>

      {/* Possible shopping list card */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Skeleton className="max-w-[400px] h-[120px]">
          <Skeleton.Text className="h-6 md:h-8" />
          <div className="flex justify-end gap-6">
            <Skeleton.Button className="h-4 md:h-6 w-10" />
            <Skeleton.Button className="h-4 md:h-6 w-10" />
          </div>
        </Skeleton>
        <Skeleton className="max-w-[400px] h-[120px]">
          <Skeleton.Text className="h-6 md:h-8" />
          <div className="flex justify-end gap-6">
            <Skeleton.Button className="h-4 md:h-6 w-10" />
            <Skeleton.Button className="h-4 md:h-6 w-10" />
          </div>
        </Skeleton>
      </div>

    </div>
  )
}
