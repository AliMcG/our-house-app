import Image from "next/image";


export default function TopNavigationBar(): JSX.Element {
  return (
    <aside className="flex justify-end h-8 w-screen mt-4 bg-fuchsia-500">
      <div>
        <h3>USERNAME</h3>
      </div>
      <Image 
        className="flex justify-center rounded-full bg-red-500"
        src="/logo.png" alt="logo" width={40} height={40} />
    </aside>
  );
}