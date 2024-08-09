import AddHouseHoldForm from "./AddHouseholdForm";
import { api } from "@/trpc/server";
import AddUserToHouseHoldForm from "./AddUserToHouseholdForm";
import DeleteUserToHouseHoldForm from "./deleteUserToHouseholdForm";
import DeleteHouseHoldForm from "./deleteHouseholdForm";
import EditHouseHoldForm from "./editHouseholdForm";

export default async function Profile() {
  /** By default pages are server components in next.js 14
   * This means we can use "@/trpc/server" to query our database.
   * Which should result in faster load times for the data.
   */
  const householdList = await api.householdRouter.list.query();

  return (
    <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-800">
      <header className="flex items-center justify-center p-4">
        <h1 className="flex text-3xl font-extrabold">Your households:</h1>
        {householdList.map((household, index) => {
          return (
            <p key={index + household.id} className="p-4 text-base font-bold">
              {household.name} with {household.id}
            </p>
          );
        })}
      </header>
      <div className="mt-5 flex justify-center">
        <div className="flex gap-4">
          <AddHouseHoldForm />
          <EditHouseHoldForm />
          <DeleteHouseHoldForm />
          <AddUserToHouseHoldForm />
          <DeleteUserToHouseHoldForm />
        </div>
      </div>
    </article>
  );
}
