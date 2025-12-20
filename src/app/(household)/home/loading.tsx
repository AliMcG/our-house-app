import { Skeleton } from "@/app/_components/ui/skeleton"


/* Custom skeleton for the Dashboard loader */
export default function loading() {
  return (
    <div className="flex flex-col size-full bg-white gap-4">
    
      {/* header */}
      <div className="flex flex-col gap-4">

        <Skeleton.Text className="w-[120px]" />

        <Skeleton className="w-[180px] h-[50px]">
          <Skeleton.Text />
        </Skeleton>
      
      </div>

      {/* main */}
      <div className="flex flex-col overflow-y-auto gap-4">

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <Skeleton className="h-[120px]">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton.Text className="col-span-2" />
              <Skeleton.Text className="col-span-1" />
              <Skeleton.Text className="col-span-3 h-4" />
            </div>
          </Skeleton>
          
          <Skeleton className="h-[120px]">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton.Text className="col-span-2" />
              <Skeleton.Text className="col-span-1" />
              <Skeleton.Text className="col-span-3 h-4" />
            </div>
          </Skeleton>

          <Skeleton className="h-[120px]">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton.Text className="col-span-2" />
              <Skeleton.Text className="col-span-1" />
              <Skeleton.Text className="col-span-3 h-4" />
            </div>
          </Skeleton>

          <Skeleton className="h-[120px]">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton.Text className="col-span-2" />
              <Skeleton.Text className="col-span-1" />
              <Skeleton.Text className="col-span-3 h-4" />
            </div>
          </Skeleton>

        </div>

        {/* Household members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton>
            <div className="grid grid-cols-3 gap-4">
              <Skeleton.Text className="col-span-2 h-6" />
              <Skeleton.Text className="col-span-1 h-6" />
              <Skeleton.Text className="col-span-3 h-6" />
              <Skeleton.Circle className="w-[40px] h-[40px] col-span-1 justify-self-center" />
              <Skeleton.Text className="col-span-2 self-center" />
            </div>
          </Skeleton>

          {/* Quick actions */}
          <Skeleton>
            <Skeleton.Text className="h-6" />
            <Skeleton.Text />
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton.Button className="w-full max-w-[260px]" />
              <Skeleton.Button className="w-full max-w-[260px]" />
            </div>
          </Skeleton>
        </div>

      </div>

    </div>
  )
}
