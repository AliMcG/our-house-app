import { api } from "@/trpc/server";

export default async function ShoppingLists() {
  /** By default pages are server components in next.js 14
   * This means we can use "@/trpc/server" to query our database.
   * Which should result in faster load times for the data.
   */
  const shoppingList = await api.shoppingList.list.query();
 
  return (
    <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-800">
      <header className="flex items-center justify-center p-4">
        <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-[2rem] lg:text-[3rem] xl:text-[4rem]">
          Profile
        </h1>
      </header>
      <div className="mt-5 flex justify-center">
        card user 
        card for household 
      </div>
    </article>
  );
}