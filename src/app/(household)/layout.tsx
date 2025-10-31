import TopNavigationBar from "../_components/layout/TopNavigationBar";
import SideNavigationBar from "../_components/layout/SideNavigationBar";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "../_components/layout/sidebar";
import Header from "../_components/layout/header";

export default async function HouseholdLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect('/')
  }
  return (
    <article>
      <div className="md:pl-[80px]">
      {/* <div className=""> */}
        {/* <TopNavigationBar /> */}
        <Header />
      </div>
      <div className="fixed top-0 left-0 z-[999]">
        {/* <SideNavigationBar /> */}
        <Sidebar />
      </div>
      <main className="md:pl-[80px]">
        {children}
      </main>
    </article>
  );
}