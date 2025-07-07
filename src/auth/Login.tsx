import type { Route } from "../+types/root";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "~/lib/hooks/useAuth";
import { useState } from "react";
import { validateInput } from "~/lib/utils/inputHelpers";
import { Constants } from "~/lib/constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    {
      name: "description",
      content: "Login to your account",
    },
  ];
}

export default function Login() {
  const { login, isLoading } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const emailInput = formData.get("email") as string;
    const passwordInput = formData.get("password") as string;

    setServerError("");

    // Validate inputs
    const emailResult = validateInput("email", emailInput);
    const passwordResult = validateInput("password", passwordInput);

    // Collect validation errors
    const newErrors: Record<string, string> = {};
    if (!emailResult.isValid) newErrors.email = emailResult.error!;
    if (!passwordResult.isValid) newErrors.password = passwordResult.error!;

    // Update error state
    setErrors(newErrors);

    // If valid, proceed with login
    if (Object.keys(newErrors).length === 0) {
      try {
        await login(emailResult.value, passwordResult.value);
        window.location.href = Constants.Routes.DASHBOARD();
      } catch (error: any) {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 404:
              setServerError("User not found. Please check your email.");
              break;
            case 500:
              setServerError("Internal server error. Please try again later.");
              break;
            default:
              setServerError("An unexpected error occurred. Please try again.");
          }
        } else if (error.request) {
          setServerError("Network error. Please check your connection.");
        } else {
          setServerError("An error occurred: " + error.message);
        }
      }
    }
  };

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-r from-blue-200 to-cyan-200">
        <div className="w-96 border p-6 shadow-lg bg-white">
          <h1 className="text-2xl font-bold mb-4 text-center uppercase">
            Login
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 grid grid-cols-12 items-center gap-10 p-4 bg-neutral-200">
              <div className="col-span-1">
                <Mail size={20} className="text-neutral-700" />
              </div>
              <div className="col-span-11">
                <input
                  placeholder="Email"
                  type="email"
                  id="email"
                  name="email"
                  className="h-full focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="mb-8 grid grid-cols-12 items-center gap-10 p-4 bg-neutral-200">
              <div className="col-span-1">
                <Lock size={20} className="text-neutral-700" />
              </div>
              <div className="col-span-11">
                <input
                  placeholder="Password"
                  type="password"
                  id="password"
                  name="password"
                  className="h-full focus:outline-none"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-800 text-white py-4 uppercase font-semibold hover:bg-cyan-900 transition-colors cursor-pointer"
            >
              Login
            </button>

            {serverError && (
              <div className="mt-4 text-red-600 text-sm">
                <p className="text-red-600 text-sm">{serverError}</p>
              </div>
            )}
            {Object.keys(errors).length > 0 && (
              <div className="mt-4 text-red-600 text-sm">
                {Object.values(errors).map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
