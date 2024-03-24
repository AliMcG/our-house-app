"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import HomePageImage from "@/public/home_logo_final.svg";


export default function TopNavigationBar(): JSX.Element {
  const session = useSession();

  return (
    <aside className="flex justify-end h-8 w-screen mt-4 px-4 bg-fuchsia-500">
      <div className="flex items-center mr-4">
        <h3>{session.data?.user.name}</h3>
      </div>
      <Link 
        href={"/"} 
        className="flex relative top-[-9px] w-[50px] h-[50px] bg-slate-800 rounded-full overflow-hidden"
      >
        <Image 
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          src={session.data ? session.data?.user.image : HomePageImage} 
          alt="logo" 
          width={40} 
          height={40} 
          className="flex justify-center w-full h-auto"
        />
      </Link>
    </aside>
  );
}