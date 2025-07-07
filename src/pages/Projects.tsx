import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Project Management" },
    {
      name: "description",
      content: "This is the Project Management Dashboard",
    },
  ];
}

export default function Projects() {
  return (
    <>
      <h1>This is Project Management</h1>
    </>
  );
}
