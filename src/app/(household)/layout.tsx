import TopNavigationBar from "../_components/TopNavigationBar";
import SideNavigationBar from "../_components/SideNavigationBar";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function HouseholdLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) {
   return redirect('/')
  }
  return (
    <article>
      <div className="fixed top-1 left-0 z-[998]">
        <TopNavigationBar />
      </div>
      <div className="fixed top-0 left-0 z-[999]">
        <SideNavigationBar />
      </div>
      <main className="md:pl-[80px]">
        {children}
      </main>
    </article>
  );
}