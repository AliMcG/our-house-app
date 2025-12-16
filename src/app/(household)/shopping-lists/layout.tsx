import Header from "@/app/_components/layout/header";


export default async function ShoppingListsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title="Shopping Lists" description="Manage multiple shopping lists" />
      <section className="p-4">
        {children}
      </section>
    </>
  );
}