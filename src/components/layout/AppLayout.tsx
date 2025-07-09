import React, { useState } from "react";
import { sidebarVisibility } from "~/lib/hooks/useSidebar";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { showSidebar } = sidebarVisibility();

  return (
    <main>
      {showSidebar && <Sidebar className="z-50" />}
      <div className={`min-h-screen ${showSidebar ? "ml-64" : ""}`}>
        {children}
      </div>
    </main>
  );
}
