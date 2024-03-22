import Image from "next/image";
import Link from "next/link";
import AuthButton from "./AuthenticationButton";
import HomePageImage from "@/public/home_logo_final.svg";
import ShoppingImage from "@/public/shopping_icon.svg";
import ChoresImage from "@/public/chores_icon.svg";


// TODO: create a button to close and open the mobile sidebar only
export default function SideNavigationBar(): JSX.Element {
  return (
    <aside className="flex flex-col justify-between h-screen w-[80px] px-1 py-2 bg-fuchsia-500">
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
        <ul>
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
    </aside>
  )
}