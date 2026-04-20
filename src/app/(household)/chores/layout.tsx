import Header from "@/app/_components/layout/header";


export default async function ChoresLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header title="Chores" description="Manage household chores and assignments" />
      <section className="p-4">
        {children}
      </section>
    </>
  );
}