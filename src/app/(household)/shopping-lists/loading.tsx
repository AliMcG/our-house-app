/* Custom skeleton for the Shopping list (landing page) loader */
export default function loading() {
  return (
    <div className="flex flex-col animate-pulse size-full bg-white p-8 gap-4">
      <div className="flex h-6 sm:h-10 md:h-12 w-full sm:w-[280px] self-center rounded bg-gray-200"></div>

      {/* Creation card */}
      <div className="flex flex-col w-full sm:w-[280px] h-[120px] md:h-[160px] place-content-center self-center rounded-md border border-purple-300 px-4 gap-4">
        <div className="h-2 md:h-4 rounded bg-gray-200"></div>
        <div className="h-6 md:h-8 rounded bg-gray-200"></div>
        <div className="h-6 md:h-8 rounded bg-gray-200"></div>
      </div>

      {/* Possible shopping list card */}
      <div className="flex flex-col md:flex-row items-center sm:mt-4 md:mt-8 gap-6">
        <div className="flex flex-col w-full max-w-[400px] h-[120px] place-content-center rounded-md border border-purple-300 px-4 gap-4">
          <div className="h-6 md:h-8 rounded bg-gray-200"></div>
          <div className="flex justify-end gap-6">
            <div className="h-4 md:h-6 w-10 rounded bg-gray-200"></div>
            <div className="h-4 md:h-6 w-10 rounded bg-gray-200"></div>
            <div className="h-4 md:h-6 w-10 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-col w-full max-w-[400px] h-[120px] place-content-center rounded-md border border-purple-300 px-4 gap-4">
          <div className="h-6 md:h-8 rounded bg-gray-200"></div>
          <div className="flex justify-end gap-6">
            <div className="h-4 md:h-6 w-10 rounded bg-gray-200"></div>
            <div className="h-4 md:h-6 w-10 rounded bg-gray-200"></div>
            <div className="h-4 md:h-6 w-10 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

    </div>
  )
}
