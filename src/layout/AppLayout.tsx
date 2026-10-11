import type { ReactNode } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

interface AppLayoutProps {
  children: ReactNode;
  activePage: "user" | "manager" | "squad" | "admin";
}

export function AppLayout({ children, activePage }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar activePage={activePage} />

      <div className="flex min-h-screen flex-col lg:pl-72">
        <Header />

        <main className="flex-1 bg-background px-4 pb-20 pt-28 md:px-gutter md:pb-0 md:pt-20">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
