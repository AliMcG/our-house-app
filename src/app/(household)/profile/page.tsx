import AddHouseHoldForm from "./AddHouseholdForm";

export default async function Profile() {
  /** By default pages are server components in next.js 14
   * This means we can use "@/trpc/server" to query our database.
   * Which should result in faster load times for the data.
   */

  return (
    <article className="flex min-h-screen flex-col bg-white pt-16 text-slate-800">
      <header className="flex items-center justify-center p-4">
        <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-[2rem] lg:text-[3rem] xl:text-[4rem]">
          Profile
        </h1>
      </header>
      <div className="mt-5 flex justify-center">
        <div className="flex flex-col gap-4">
          <p>card user </p>
          <p>card for household </p>
          <AddHouseHoldForm />
        </div>
      </div>
    </article>
  );
}
