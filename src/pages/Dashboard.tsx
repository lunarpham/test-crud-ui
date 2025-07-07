import type { Route } from "../+types/root";
import AppLayout from "../components/layout/AppLayout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    {
      name: "description",
      content: "Welcome to the User/Project Management Dashboard!",
    },
  ];
}

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard!</h1>
      </div>
    </AppLayout>
  );
}
