import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register" },
    {
      name: "description",
      content: "Register a new account",
    },
  ];
}

export default function Register() {
  return (
    <>
      <h1>This is Register page</h1>
    </>
  );
}
