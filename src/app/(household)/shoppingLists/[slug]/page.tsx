import Card from "@/app/_components/Card";
import AddShoppingItemForm from "@/app/_components/AddShoppingItemForm";
import { api } from "@/trpc/server";
import ItemsList from "./ItemsList";
import Link from "next/link";
import {navbarLinks} from "@/app/utils/navbarLinks";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { convertURLtoString } from "@/app/utils/helperFunctions";


export default async function Page({ params }: { params: { slug: string } }) {
  // lets try fetching shopping list by its name as we expect uniqueness between households
  const shoppingListName = convertURLtoString(params.slug);
  const shoppingList = await api.shoppingListItem.list.query({ title: shoppingListName });
  
  return (
    <div>
      <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-800">
        <header className="flex items-center justify-center p-4">
          <Link 
            href={navbarLinks[0]!.link} className="w-[32px] h-[32px] mr-2 rounded-md hover:bg-gray-200 transition"
            data-cy="back-to-shoppings-lists-link"
          >
            <ArrowUturnLeftIcon className="text-[#b372f0]" />
          </Link>
          <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-[2rem] lg:text-[3rem] xl:text-[4rem]">
            {shoppingListName}
          </h1>
        </header>
        <div className="mt-5 flex justify-center">
          <Card>
            <AddShoppingItemForm listID={shoppingList?.listID ?? null} />
          </Card>
        </div>
        <div className="p-4">
        {(shoppingList.status !== 'list items found') 
          ? 
            <p className="text-center">No items in this list</p> 
          : 
            <ItemsList list={shoppingList} />
        }
        </div>
      </article>
    </div>
  );
}