import TopNavigationBar from "../_components/TopNavigationBar";
import SideNavigationBar from "../_components/SideNavigationBar";


export default function HouseholdLayout({ children }: { children: React.ReactNode }): JSX.Element {
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