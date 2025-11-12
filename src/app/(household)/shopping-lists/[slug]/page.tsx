import Card from "@/app/_components/Card";
import AddShoppingItemForm from "@/app/_components/AddShoppingItemForm";
import { api } from "@/trpc/server";
import ItemsList from "./ItemsList";
import Link from "next/link";
import { navbarLinks } from "@/app/utils/navbarLinks";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { convertURLtoString } from "@/app/utils/helperFunctions";


export default async function Page({ params }: { params: { slug: string } }) {

  const shoppingListId = convertURLtoString(params.slug);
  const shoppingList = await api.shoppingList.findById.query({ id: shoppingListId });

  const shoppingListItems = await api.shoppingListItem.list.query({ shoppingListId: shoppingListId });

  return (
    <div>
      <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-800">
        <header className="flex items-center justify-center p-4">
          <Link
            href={navbarLinks[0]!.href} className="w-[32px] h-[32px] mr-2 rounded-md hover:bg-gray-200 transition"
            data-cy="back-to-shoppings-lists-link"
          >
            <ArrowUturnLeftIcon className="text-[#b372f0]" />
          </Link>
          <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-[2rem] lg:text-[3rem] xl:text-[4rem]">
            {shoppingList?.title}
          </h1>
        </header>
        <div className="mt-5 flex justify-center">
          <Card>
            <AddShoppingItemForm listId={shoppingList?.id} />
          </Card>
        </div>
        <div className="p-4">
          {shoppingListItems.length
            ? <ItemsList list={shoppingListItems} />
            :
            <p className="text-center">No items in this list</p>
          }
        </div>
      </article>
    </div>
  );
}