import React from "react";
import type { Route } from "../+types/root";
import AppLayout from "../components/layout/AppLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile Settings" },
    {
      name: "description",
      content:
        "This is the user profile page where you can manage your settings.",
    },
  ];
}

export default function Profile() {
  return (
    <AppLayout>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">This is the Profile Page!</h1>
      </div>
    </AppLayout>
  );
}
