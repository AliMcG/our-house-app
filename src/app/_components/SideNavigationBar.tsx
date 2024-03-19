import Image from "next/image";
import AuthButton from "./AuthenticationButton";


export default function SideNavigationBar(): JSX.Element {
  return (
    <aside className="flex flex-col justify-between h-screen w-[64px] bg-fuchsia-500">
      <Image src={"/logo.png"} alt="logo" width={40} height={40} />
      <nav></nav>
      <AuthButton size="small" />
    </aside>
  )
}