import Image from "next/image";
import Link from "next/link";
import { navbarLinks } from "@/app/utils/navbarLinks";
import { api } from "@/trpc/server";

export default async function Home() {
  const householdList = await api.householdRouter.list.query();

  /**
   * // TODO
   * The Dashboard should list the households the user is part of at the top:
   * with the first in the list highlighted as the current household
   * below that should be quick links to the main sections:
   * - Shopping Lists
   * - Tasks/Chores
   * - Calendar
   * - Members  
   * This should be in a grid layout with icons for each section - maybe as two items in the the card.
   * A quick action button on each section to create a new item in that section.
   * Clicking on the section should take the user to that section within the current household.
   * or clicking on the quick action button should open a modal to create a new item in that section.
   * i.e. clicking on the shopping lists section should take the user to the shopping lists page for the current household
   * clicking on the quick action button on the shopping lists section should open a modal to create a new shopping list for the current household.
   */

  return (
    <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-700">
      <header className="flex ml-24 pl-6 p-4 mt-2">
        {householdList.map((household, index) => {
          return (
            <div>
              <h1 className="hover:bg-slate-100 cursor-pointer text-center xl:text-3xl font-extrabold tracking-tight md:text-1xl lg:text-2xl  rounded-2xl border-2 border-solid border-slate-400 shadow-lg">
                <p key={index + household.id} className="p-4">
                  {household.name}
                </p>
              </h1>
            </div>

          );
        })}
      </header>
      <ul className="container flex grow flex-col items-center justify-center gap-y-16 px-4 pb-4 pt-16 md:flex-row md:gap-2 lg:gap-16">
        {navbarLinks.map((item, index) => (
          <li
            key={index}
            className="hover:bg-slate-100 flex h-[180px] w-full max-w-[320px] flex-col items-center justify-center rounded-2xl border-2 border-solid border-slate-400 shadow-lg"
          >
            <Link
              href={item.href}
              className="z-50 size-full rounded-2xl bg-white"
            >
              <span className="relative flex h-1/5 w-full justify-center">
                <span className="absolute top-[-40px] flex h-[80px] w-6/12 items-center justify-center rounded-lg border-2 border-solid border-slate-400 bg-white">
                  <Image
                    src={item.icon as string}
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
