import Image from "next/image";
import Link from "next/link";
import { navbarLinks } from "@/app/utils/navbarLinks";
import { api } from "@/trpc/server";

export default async function Home() {
  const householdList = await api.householdRouter.list.query();

  return (
    <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-800">
      <header className="flex items-center justify-center p-4">
        <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-[2rem] lg:text-[3rem] xl:text-[4rem]">
          {householdList.map((household, index) => {
            return (
              <p key={index + household.id} className="p-4">
                {household.name}
              </p>
            );
          })}
        </h1>
      </header>
      <ul className="container flex grow flex-col items-center justify-center gap-y-16 px-4 pb-4 pt-16 md:flex-row md:gap-2 lg:gap-16">
        {navbarLinks.map((item, index) => (
          <li
            key={index}
            className="hover:bg- flex h-[180px] w-full max-w-[320px] flex-col items-center justify-center rounded-2xl border-2 border-solid border-slate-400 shadow-lg"
          >
            <Link
              href={item.link}
              className="z-50 size-full rounded-2xl bg-white"
            >
              <span className="relative flex h-1/5 w-full justify-center">
                <span className="absolute top-[-40px] flex h-[80px] w-6/12 items-center justify-center rounded-lg border-2 border-solid border-slate-400 bg-white">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    height={64}
                    width={80}
                  />
                </span>
              </span>
              <span className="flex size-full h-3/5 items-center justify-center text-xl font-semibold">
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
