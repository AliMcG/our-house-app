"use client"

import HomePageImage from "@/public/home_logo_final.svg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation } from "../../utils/navigation-links";
import AuthButton from "../AuthenticationButton";
import Button from "../Button";


export default function SideNavigationBar(): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  // conditionally render the sidebar based on the menuOpen state
  let xTranslateMenu = 'translate-x-[-80px]';

  if (menuOpen) {
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
    <aside className={`flex flex-col justify-between h-screen w-[80px] px-1 py-2 ${xTranslateMenu} md:translate-x-0 transition transform ease-in-out duration-300 bg-fuchsia-500 z-[999]`}>
      <Link href={"/home"} className="flex self-center relative w-9/12">
        <Image
          src={HomePageImage as string}
          alt="logo"
          width={60}
          height={60}
          className="w-full h-auto"
        />
      </Link>
      <nav>
        <ul onClick={() => setMenuOpen(prevState => !prevState)}>
          {
            navigation.map((item, index) => {
              return (
                <li key={index}>
                  <Link href={item.href}>
                    <Image
                      src={item.icon as string}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="w-full h-auto"
                    />
                  </Link>
                </li>
              )
            })
          }
        </ul>
      </nav>
      <AuthButton size="small" />
      <Button type="button"
        aria-pressed={menuOpen}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label="menu button"
        className="absolute top-[100px] left-[40px] w-[80px] h-[80px] rounded-full bg-fuchsia-500 md:hidden hover:bg-fuchsia-500 shadow-none"
        onClick={() => setMenuOpen(prevState => !prevState)}>
      </Button>
    </aside>
  );
}