/* Custom skeleton for the Dashboard loader */
export default function loading() {
  // used purple borders to match our current theme but can be adjusted later
  return (
    <div className="flex flex-col size-full bg-white p-8 pt-16 gap-4">

      {/* header */}
      <div className="flex flex-col sm:flex-row gap-4">

        <div className="w-[200px] h-[60px] place-content-center rounded-md border border-purple-300 px-4">
          <div className="h-2 md:h-4 rounded bg-gray-200"></div>
        </div>
 
        <div className="w-[180px] h-[60px] place-content-center rounded-md border border-purple-300 px-4">
          <div className="h-2 rounded bg-gray-200"></div>
        </div>
      
      </div>

      {/* main */}
      <div className="flex flex-col overflow-y-auto gap-4">

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="w-full h-[120px] place-content-center rounded-md border border-purple-300 px-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                <div className="col-span-3 h-4 rounded bg-gray-200"></div>
              </div>
            </div>
            
            <div className="w-full h-[120px] place-content-center rounded-md border border-purple-300 px-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                <div className="col-span-3 h-4 rounded bg-gray-200"></div>
              </div>
            </div>

            <div className="w-full h-[120px] place-content-center rounded-md border border-purple-300 px-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                <div className="col-span-3 h-4 rounded bg-gray-200"></div>
              </div>
            </div>

            <div className="w-full h-[120px] place-content-center rounded-md border border-purple-300 px-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                <div className="col-span-3 h-4 rounded bg-gray-200"></div>
              </div>
            </div>

          </div>

          {/* Household members */}
          <div className="w-full h-[120px] place-content-center rounded-md border border-purple-300 px-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-6 rounded bg-gray-200"></div>
              <div className="col-span-1 h-6 rounded bg-gray-200"></div>
              <div className="col-span-3 h-6 rounded bg-gray-200"></div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-col h-[200px] place-content-center rounded-md border border-purple-300 px-4 gap-4">
            <div className="h-6 w-full rounded bg-gray-200"></div>
            <div className="h-2 w-full rounded bg-gray-200"></div>
            <div className="h-16 w-full rounded bg-gray-200"></div>
          </div>

      </div>

    </div>
  )
}
