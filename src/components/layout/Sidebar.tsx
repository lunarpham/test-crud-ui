import React from "react";
import { Constants } from "~/lib/constants";
import { Link, useLocation } from "react-router";
import {
  User,
  Users,
  SquareChartGantt,
  LayoutDashboard,
  X,
} from "lucide-react";
import { useAuthContext } from "~/lib/contexts/authContext";

interface SidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  className = "",
  isMobileOpen = false,
  onMobileClose = () => {},
}: SidebarProps) {
  const location = useLocation();
  const { user } = useAuthContext();

  const navItems = [
    {
      label: "Dashboard",
      to: Constants.Routes.DASHBOARD(),
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Projects",
      to: Constants.Routes.PROJECTS(),
      icon: <SquareChartGantt size={20} />,
    },
    {
      label: "Users",
      to: Constants.Routes.USERS(),
      icon: <Users size={20} />,
    },
  ];

  const handleNavClick = () => {
    // Close mobile sidebar when navigation item is clicked
    onMobileClose();
  };

  return (
    <div
      className={`
        h-screen flex flex-col justify-between fixed top-0 left-0 p-4 w-64 
        bg-white border-r border-gray-200 transition-transform duration-300 z-50
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${className}
      `}
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-xl text-indigo-900">API Manager</h1>
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors md:hidden"
            onClick={onMobileClose}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={handleNavClick}
              className={`
                flex items-center gap-3 py-3 px-4 rounded-full transition-colors
                ${
                  location.pathname === item.to
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <Link
          to={Constants.Routes.PROFILE()}
          onClick={handleNavClick}
          className="flex items-center gap-3 py-3 px-4 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
            <User size={20} className="text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">
              {user?.name || "Guest"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || "guest@example.com"}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
