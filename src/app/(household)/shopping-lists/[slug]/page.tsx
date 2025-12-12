import AddShoppingItemForm from "@/app/_components/AddShoppingItemForm";
import Card from "@/app/_components/Card";
import { convertURLtoString } from "@/app/utils/helperFunctions";
import { navigation } from "@/app/utils/navigation-links";
import { api } from "@/trpc/server";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import ItemsList from "./ItemsList";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shoppingListId = convertURLtoString(slug);
  const shoppingList = await api.shoppingList.findById.query({
    id: shoppingListId,
  });

  const shoppingListItems = await api.shoppingListItem.list.query({
    shoppingListId: shoppingListId,
  });

  return (
    <div>
      <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-800">
        <header className="flex items-center justify-center p-4">
          <Link
            href={navigation[1]!.href}
            className="mr-2 h-[32px] w-[32px] rounded-md transition hover:bg-gray-200"
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
          {shoppingListItems.length ? (
            <ItemsList list={shoppingListItems} />
          ) : (
            <p className="text-center">No items in this list</p>
          )}
        </div>
      </article>
    </div>
  );
}
