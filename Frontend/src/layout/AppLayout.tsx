import type { ReactNode } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { MobileStatsBar } from "../components/layout/MobileStatsBar";
import { MobileBottomNav } from "../components/layout/MobileBottomNav";
import { Footer } from "../components/layout/Footer";
import type { ActivePage } from "../components/layout/navigation";

interface AppLayoutProps {
  children: ReactNode;
  activePage: ActivePage;
}

export function AppLayout({ children, activePage }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar activePage={activePage} />

      <div className="flex min-h-screen flex-col pb-20 lg:pb-0 lg:pl-72">
        <Header />
        <MobileStatsBar />

        <main className="flex-1 bg-background px-4 pb-6 pt-28 md:px-gutter md:pt-24 lg:pt-28">
          {children}
        </main>

        <Footer />
      </div>

      <MobileBottomNav activePage={activePage} />
    </div>
  );
}
