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
      <div className="fixed top-1 left-0">
        <TopNavigationBar />
      </div>
      <div className="fixed top-0 left-0">
        <SideNavigationBar />
      </div>
      <main>
        {children}
      </main>
    </article>
  );
}