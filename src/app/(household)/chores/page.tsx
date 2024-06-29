import Card from "@/app/_components/Card";
import AddChoresForm from "../../_components/AddChoresForm";
import ChoresCard from "./ChoresCard";
import { api } from "@/trpc/server";


export default async function Chores() {
  const choresList = await api.chores.list.query();

  return (
    <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-800">
      <header className="flex items-center justify-center p-4">
        <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-[2rem] lg:text-[3rem] xl:text-[4rem]">
          Chores
        </h1>
      </header>
      <div className="mt-5 flex justify-center">
        <Card>
          <AddChoresForm />
        </Card>
      </div>
      {choresList?.map((listItem, index) => {
        return <ChoresCard key={index} choresList={listItem} />
      })}
    </article>
  );
}
