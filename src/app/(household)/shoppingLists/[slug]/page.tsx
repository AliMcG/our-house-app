import Card from "@/app/_components/Card";
import AddItemForm from "@/app/_components/AddItemForm";
import { api } from "@/trpc/server";


export default async function Page({ params }: { params: { slug: string } }) {
  // lets try fetching shopping list by its name as we expect uniqueness between households
  const shoppingListName = params.slug;
  const shoppingList = await api.shoppingListItem.list.query({ title: shoppingListName });

  return (
    <div>
      <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-800">
      <header className="flex items-center justify-center p-4">
        <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-[2rem] lg:text-[3rem] xl:text-[4rem]">
          {shoppingListName}
        </h1>
      </header>
      <div className="mt-5 flex justify-center">
        <Card>
          <AddItemForm apiName="shoppingListItem" listId={shoppingList.listID ?? shoppingList.status} />
        </Card>
      </div>
      <div className="p-4">
      {(shoppingList.status !== 'list items found') 
        ? 
          <p className="text-center">No items in this list</p> 
        : 
          shoppingList.items?.map((item, index) => {
            return <Card key={index}>{item.name}</Card>
          }
      )}
      </div>
    </article>
    </div>
  );
}