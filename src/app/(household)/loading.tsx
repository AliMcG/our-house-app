/* Custom skeleton for the Shopping list (landing page) loader */
export default function loading() {
  return (
    <div className="grid size-full place-content-center bg-white p-8 gap-4">
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
        <p className="text-center text-gray-300">loading content...</p>
      </div>
    </div>
  )
}
