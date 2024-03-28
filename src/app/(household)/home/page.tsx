import Image from "next/image";
import Link from "next/link";
import { navbarLinks } from "@/app/utils/navbarLinks";


export default async function Home() {
  return (
    <article className="flex min-h-screen flex-col pt-16 bg-white text-slate-800">
      <header className="flex items-center justify-center p-4">
        <h1 className="text-center text-5xl font-extrabold tracking-tight md:text-[5rem]">
          HOUSEHOLD
        </h1>
      </header>
      <ul className="container flex flex-col items-center justify-center gap-y-16 grow px-4 pt-16 pb-4 md:flex-row md:gap-2 lg:gap-16">
        {
          navbarLinks.map((item, index) => (
            <li key={index} className="flex flex-col items-center justify-center border-2 border-solid border-slate-400 rounded-2xl w-full max-w-[320px] h-[180px] shadow-lg hover:bg-">
              <Link href={item.link} className="bg-white rounded-2xl size-full z-50">
                <span className="flex justify-center relative w-full h-1/5">
                  <span className="bg-white flex justify-center items-center absolute top-[-40px] block border-2 border-solid border-slate-400 rounded-lg w-6/12 h-[80px]">
                    <Image src={item.icon} alt={item.name} height={64} width={80} />
                  </span>
                </span>
                <span className="block flex justify-center items-center h-3/5 text-xl font-semibold size-full">
                  {item.name}
                </span>
              </Link>
            </li>
          ))
        }
      </ul>
    </article>
  );
}
