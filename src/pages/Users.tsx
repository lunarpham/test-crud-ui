import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "User Management" },
    {
      name: "description",
      content: "This is the User Management Dashboard",
    },
  ];
}

export default function Users() {
  return (
    <>
      <h1>This is User Management</h1>
    </>
  );
}
