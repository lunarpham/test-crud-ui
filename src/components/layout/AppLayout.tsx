import React, { useState } from "react";
import { sidebarVisibility } from "~/lib/hooks/useSidebar";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { showSidebar } = sidebarVisibility();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main>
      {showSidebar && <Sidebar className="z-50" collapsed={collapsed} />}
      <div
        className={`min-h-screen ${
          showSidebar ? (collapsed ? "ml-16" : "ml-64") : ""
        }`}
      >
        {children}
      </div>
    </main>
  );
}
