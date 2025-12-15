import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "../_components/layout/sidebar";


export default async function HouseholdLayout({ children }: { children: React.ReactNode }) {
  // only authorised users can access household routes
  const session = await getServerAuthSession();
  if (!session) {
    return redirect('/')
  }


  return (
    <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-[200px_1fr] h-screen w-screen overflow-hidden">
      <header className="fixed top-0 left-0 h-screen w-[0px] md:w-[200px] z-40 md:relative">
        <Sidebar />
      </header>
      <main className="w-full h-full overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}