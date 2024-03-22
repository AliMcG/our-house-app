"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthButton from "./AuthenticationButton";
import HomePageImage from "@/public/home_logo_final.svg";
import ShoppingImage from "@/public/shopping_icon.svg";
import ChoresImage from "@/public/chores_icon.svg";


export default function SideNavigationBar(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  // conditionally render the sidebar based on the menuOpen state
  let xTranslateMenu = 'translate-x-[-80px]';

  if (menuOpen) {
    console.log("menuOpen: ", menuOpen)
    xTranslateMenu = 'translate-x-0';
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768 && menuOpen) {
        setMenuOpen(false);
      }
    }
    // lets keep track of the window size
    window.addEventListener('resize', handleResize);
    // make sure to remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  });

  return (
    <aside className={`flex flex-col justify-between h-screen w-[80px] px-1 py-2 ${xTranslateMenu} md:translate-x-0 transition transform ease-in-out duration-300 bg-fuchsia-500 z-50`}>
      <Link href={"/home"} className="flex self-center relative w-9/12">
        <Image
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          src={HomePageImage} 
          alt="logo" 
          width={60} 
          height={60} 
          className="w-full h-auto"
        />
      </Link>
      <nav>
        <ul onClick={() => setMenuOpen(prevState => !prevState)}>
          <li>
            <Link href={"/shoppingLists"}>
              <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                src={ShoppingImage} 
                alt="shopping cart icon" 
                width={60} 
                height={60} 
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
            </Link>
          </li>
          <li>
            <Link href={"/chores"}>
              <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                src={ChoresImage} 
                alt="brush and pan icon" 
                width={60} 
                height={60} 
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
            </Link>
          </li>
        </ul>
      </nav>
      <AuthButton size="small" />
      <button 
        type="button"
        aria-pressed={menuOpen}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label="menu button"
        className="absolute top-[100px] left-[40px] w-[80px] h-[80px] rounded-full bg-fuchsia-500 md:hidden"
        onClick={() => setMenuOpen(prevState => !prevState)}
      ></button>
    </aside>
  )
}