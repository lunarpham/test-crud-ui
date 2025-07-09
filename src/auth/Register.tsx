import type { Route } from "../+types/root";
import { useState } from "react";
import { useAuth } from "~/lib/hooks/useAuth";
import { validateInput, normalizeInput } from "~/lib/utils/inputHelpers";
import { handleApiError } from "~/lib/utils/errorHandler";
import { Constants } from "~/lib/constants";
import Input from "~/components/ui/Input";

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
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    // Store raw input value without normalization
    let processedValue = value;

    // Only convert age to number if needed
    if (field === "age" && value) {
      const ageNum = parseInt(value);
      // Only store valid numbers
      if (!isNaN(ageNum)) {
        processedValue = value;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate inputs with normalized values
    const normalizedName = normalizeInput(formData.name);
    const normalizedEmail = normalizeInput(formData.email);

    const nameResult = validateInput("text", normalizedName);
    const emailResult = validateInput("email", normalizedEmail);
    const passwordResult = validateInput("password", formData.password);

    // Collect validation errors
    const newErrors: Record<string, string> = {};
    if (!nameResult.isValid || !nameResult.value)
      newErrors.name = "Name is required";
    if (!emailResult.isValid) newErrors.email = emailResult.error!;
    if (!passwordResult.isValid) newErrors.password = passwordResult.error!;

    // Age validation (optional)
    let age: number | undefined;
    if (formData.age) {
      const normalizedAge = normalizeInput(formData.age);
      age = parseInt(normalizedAge);
      if (isNaN(age) || age <= 0) {
        newErrors.age = "Age must be a positive number";
      }
    }

    // Update error state
    setErrors(newErrors);

    // If valid, proceed with registration
    if (Object.keys(newErrors).length === 0) {
      try {
        await register(
          nameResult.value,
          emailResult.value,
          passwordResult.value,
          age
        );
        // Redirect to login after successful registration
        window.location.href = Constants.Routes.LOGIN();
      } catch (error: any) {
        handleApiError(error);
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-200">
      <div className="w-96 border p-6 shadow-lg bg-white rounded-xl">
        <h1 className="text-2xl font-bold mb-4 text-center uppercase">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            variant="name"
            name="name"
            label="Name"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={errors.name}
            required
          />
          <Input
            variant="email"
            name="email"
            label="Email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            required
          />
          <Input
            variant="password"
            name="password"
            label="Password"
            id="password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            error={errors.password}
            required
          />
          <Input
            variant="age"
            name="age"
            label="Age (optional)"
            id="age"
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            error={errors.age}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-sky-800 text-white py-4 uppercase font-semibold hover:bg-sky-900 transition-colors cursor-pointer disabled:bg-sky-400"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href={Constants.Routes.LOGIN()}
              className="text-cyan-800 hover:underline"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
