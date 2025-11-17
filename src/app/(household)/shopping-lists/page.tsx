import Card from "@/app/_components/Card";
import AddShoppingListForm from "../../_components/AddShoppingListForm";
import ShoppingListCard from "./ShoppingListCard";
import { api } from "@/trpc/server";
import type { HouseholdWithRelations } from "../home/page";


export default async function ShoppingLists() {
  /** By default pages are server components in next.js 14
   * This means we can use "@/trpc/server" to query our database.
   * Which should result in faster load times for the data.
   */
  const shoppingList = await api.shoppingList.list.query();

  const householdList: HouseholdWithRelations[] = await api.householdRouter.list.query();

  /**
   * This is a temporary fix to get the current household.
   * The updated logic in the AddShoppingListForm component requires the household Id to create a new shopping list.
   * // TODO: Implement proper household selection logic to allow users to select and switch between households.
   */
  const currentHousehold = householdList[0]
  if (!currentHousehold) {
    throw new Error("No household found for the current user");
  }

  return (
    <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-800">
      <header className="flex items-center justify-center p-4">
        <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-[2rem] lg:text-[3rem] xl:text-[4rem]">
          Shopping Lists
        </h1>
      </header>
      <div className="mt-5 flex justify-center">
        <Card>
          <AddShoppingListForm householdId={currentHousehold?.id} />
        </Card>
      </div>
      {shoppingList?.map((listItem, index) => {
        return <ShoppingListCard key={index} shoppingList={listItem} />
      })}
    </article>
  );
}
