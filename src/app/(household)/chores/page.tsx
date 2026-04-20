import Card from "@/app/_components/Card";
import AddChoresForm from "../../_components/AddChoresForm";
import ChoresCard from "./ChoresCard";
import { api } from "@/trpc/server";
import Header from "@/app/_components/layout/header";


export default async function Chores() {
  const choresList = await api.chores.list.query();

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white  text-slate-800">
        <div className="mt flex justify-center">
          <Card>
            <AddChoresForm />
          </Card>
        </div>
        {choresList?.map((listItem, index) => {
          return <ChoresCard key={index} choresList={listItem} />
        })}
      </div>
    </>
  );
}
