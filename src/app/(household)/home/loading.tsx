import { Skeleton } from "@/app/_components/ui/skeleton"


/* Custom skeleton for the Dashboard loader */
export default function loading() {
  // used purple borders to match our current theme but can be adjusted later
  return (
    <div className="flex flex-col size-full bg-white p-8 gap-4">

      {/* header */}
      <div className="flex flex-col sm:flex-row animate-pulse gap-4">

        <Skeleton className="w-[200px] h-[60px]">
          <Skeleton.Text />
        </Skeleton>

        <Skeleton className="w-[180px] h-[60px]">
          <Skeleton.Text />
        </Skeleton>
      
      </div>

      {/* main */}
      <div className="flex flex-col animate-pulse overflow-y-auto gap-4">

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

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
            <Skeleton.Button className="w-full max-w-[200px]" />
            <Skeleton.Button className="w-full max-w-[200px]" />
          </Skeleton>

      </div>

    </div>
  )
}
