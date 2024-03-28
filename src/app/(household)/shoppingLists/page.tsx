import AddItemForm from "./AddItemForm";


export default async function ShoppingLists() {
  return (
    <article className="flex min-h-screen flex-col pt-16 bg-white text-slate-800">
      <header className="flex items-center justify-center p-4">
        <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-[2rem] lg:text-[3rem] xl:text-[4rem]">
        Shopping Lists
        </h1>
      </header>
      <AddItemForm />
    </article>
  );
}
