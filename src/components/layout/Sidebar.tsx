import React, { useState } from "react";
import { Constants } from "~/lib/constants";
import { Link, useLocation } from "react-router";
import { User, Users, SquareChartGantt, LayoutDashboard } from "lucide-react";
import { useAuthContext } from "~/lib/contexts/authContext";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = "" }: SidebarProps) {
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

  return (
    <aside
      className={`fixed left-0 top-0 h-screen p-4 flex flex-col justify-between bg-white border-r border-gray-200 transition-all duration-300 w-64 ${className}`}
    >
      <div>
        <h1 className="p-4 font-bold text-indigo-900">API Manager</h1>
        <div className="space-y-2 w-full">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-2 py-3 px-4 rounded-full transition-colors ${
                location.pathname === item.to
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="bottom">
        <Link
          to={Constants.Routes.PROFILE()}
          className="flex items-center gap-2 py-3 px-4 bg-gray-100 rounded-full cursor-pointer"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
            <User size={24} className="text-gray-500" />
          </div>
          <div className="text-xs">
            <p className="font-semibold">{user?.name || "Guest"}</p>
            <p className="text-gray-500">
              {user?.email || "guest@example.com"}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
