import Card from "@/app/_components/Card";
import AddChoresItemForm from "@/app/_components/AddChoresItemForm";
import { api } from "@/trpc/server";
import ItemsList from "./ItemsList";
import Link from "next/link";
import { navbarLinks } from "@/app/utils/navbarLinks";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { convertURLtoString } from "@/app/utils/helperFunctions";


export default async function Page({ params }: { params: { slug: string } }) {
  // lets try fetching chores by their name as we expect uniqueness between households
  const choresName = convertURLtoString(params.slug);
  const choresList = await api.choresItem.list.query({ title: choresName });

  return (
    <div>
      <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-800">
        <header className="flex items-center justify-center p-4">
          <Link href={navbarLinks[1]!.link} className="w-[32px] h-[32px] mr-2 rounded-md hover:bg-gray-200 transition">
            <ArrowUturnLeftIcon className="text-[#b372f0]" />
          </Link>
          <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-[2rem] lg:text-[3rem] xl:text-[4rem]">
            {choresName}
          </h1>
        </header>
        <div className="mt-5 flex justify-center">
          <Card>
            <AddChoresItemForm listID={choresList?.listID ?? null} />
          </Card>
        </div>
        <div className="p-4">
        {(choresList.status !== 'list items found') 
          ? 
            <p className="text-center">No items in this list</p> 
          : 
            <ItemsList list={choresList} />
        }
        </div>
      </article>
    </div>
  );
}