import React from "react";
import { sidebarVisibility } from "~/lib/hooks/useSidebar";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { showSidebar } = sidebarVisibility();

  return (
    <main className={showSidebar ? "flex" : ""}>
      {showSidebar && <Sidebar className="h-screen z-50" />}
      <div className="flex-1">{children}</div>
    </main>
  );
}
