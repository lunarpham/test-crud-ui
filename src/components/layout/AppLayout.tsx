import React, { useState } from "react";
import { sidebarVisibility } from "~/lib/hooks/useSidebar";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { showSidebar } = sidebarVisibility();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <main>
      {showSidebar && (
        <Sidebar
          className="z-50"
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={closeMobileSidebar}
        />
      )}

      {/* Mobile overlay */}
      {showSidebar && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <div
        className={`px-8 py-4 flex items-center justify-between ${
          showSidebar ? "md:hidden" : ""
        }`}
      >
        <h1 className="font-bold text-xl text-indigo-900">API Manager</h1>
        <button
          className="px-4 py-3 transition-colors border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={showSidebar ? toggleMobileSidebar : () => {}}
        >
          <Menu size={20} />
        </button>
      </div>

      <div
        className={`min-h-screen transition-all duration-300 ${
          showSidebar ? "md:ml-64" : ""
        }`}
      >
        {children}
      </div>
    </main>
  );
}
