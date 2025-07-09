import type { Route } from "../+types/root";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "~/lib/hooks/useAuth";
import { useState } from "react";
import { validateInput, normalizeInput } from "~/lib/utils/inputHelpers";
import { handleApiError } from "~/lib/utils/errorHandler";
import { Constants } from "~/lib/constants";
import Input from "~/components/ui/Input";

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
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = normalizeInput(formData.email);
    const emailResult = validateInput("email", normalizedEmail);
    const passwordResult = validateInput("password", formData.password);

    const newErrors: Record<string, string> = {};
    if (!emailResult.isValid) newErrors.email = emailResult.error!;
    if (!passwordResult.isValid) newErrors.password = passwordResult.error!;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await login(emailResult.value, passwordResult.value);
        // Only navigate if login was successful (no exception thrown)
        window.location.href = Constants.Routes.DASHBOARD();
      } catch (error: any) {
        handleApiError(error);
        setErrors({ general: "Invalid email or password. Please try again." });
      }
    }
  };

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-gray-200">
        <div className="w-96 border p-6 shadow-lg bg-white rounded-xl">
          <h1 className="text-2xl font-bold mb-4 text-center uppercase">
            Login
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {errors.general}
              </div>
            )}
            <Input
              variant="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              required
            />
            <Input
              variant="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-sky-800 text-white py-4 uppercase font-semibold hover:bg-sky-900 transition-colors cursor-pointer"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href={Constants.Routes.REGISTER()}
                className="text-cyan-800 hover:underline"
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
