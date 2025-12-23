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
      {/* the Skip Link */}
      <a href="#main-content" className="absolute top-[-100px] left-0 w-screen px-4 py-2 z-50 text-center bg-slate-900 text-slate-100 focus:translate-y-[100px]">
        Skip to main content
      </a>
      <header className="fixed top-0 left-0 h-screen w-[0px] md:w-[200px] z-40 md:relative">
        <Sidebar />
      </header>
      <main id="main-content" tabIndex={-1} className="grid grid-rows-[80px_1fr] grid-cols-1 w-full h-full content-start overflow-x-hidden overflow-y-auto">
        {children}
      </main>
    </div>
  );
}