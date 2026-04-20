import { Skeleton } from "@/app/_components/ui/skeleton";


/* Custom skeleton for the Shopping list - list of items loader */
export default function loading() {
  return (
    <div className="flex flex-col size-full bg-white gap-4">
      <Skeleton.Text className="flex h-6 sm:h-10 md:h-12 max-w-[400px] self-center" />

      {/* Creation card */}
      <Skeleton className="grid grid-cols-[70%_30%] max-w-[400px] self-center">
        <Skeleton.Text className="col-span-1 md:h-4" />
        <Skeleton.Text className="col-span-1 md:h-4 max-w-[80px] justify-self-center" />
        <Skeleton.Text className="col-span-1 h-6 md:h-8" />
        <Skeleton.Text className="col-span-1 h-6 md:h-8 max-w-[80px] justify-self-center" />
        <Skeleton.Button className="col-span-2 justify-self-end" />
      </Skeleton>

      {/* Possible shopping list card */}
      <div className="flex flex-col flex-wrap items-center sm:mt-4 md:mt-8 gap-6">

        <Skeleton className="max-w-[800px]">
          <div className="grid grid-cols-[64px_1fr_64px] place-items-center">
            <Skeleton.Button className="cols-span-1 w-[32px] h-[32px]" />
            <Skeleton.Text className="cols-span-1 md:h-4" />
            <Skeleton.Button className="cols-span-1 w-[32px] h-[32px]" />
          </div>
        </Skeleton>
        
        <Skeleton className="max-w-[800px]">
          <div className="grid grid-cols-[64px_1fr_64px] place-items-center">
            <Skeleton.Button className="cols-span-1 w-[32px] h-[32px]" />
            <Skeleton.Text className="cols-span-1 md:h-4" />
            <Skeleton.Button className="cols-span-1 w-[32px] h-[32px]" />
          </div>
        </Skeleton>

      </div>

    </div>
  )
}