import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "../_components/layout/sidebar";
import Header from "../_components/layout/header";

export default async function HouseholdLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect('/')
  }
// TODO review the CSS for layout to ensure proper spacing and alignment on all pages and devices.

  return (
    <article>
      <div className="md:pl-[80px]">
        <Header />
      </div>
      <div className="fixed top-0 left-0 z-[999]">
        <Sidebar />
      </div>
      <main className="md:pl-[80px]">
        {children}
      </main>
    </article>
  );
}