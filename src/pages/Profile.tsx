import React, { useState, useEffect } from "react";
import type { Route } from "../+types/root";
import AppLayout from "../components/layout/AppLayout";
import Input from "~/components/ui/Input";
import { useAuthContext } from "~/lib/contexts/authContext";
import { useUser } from "~/lib/hooks/useUser";
import { handleApiError, showSuccess } from "~/lib/utils/errorHandler";
import { validateInput, normalizeInput } from "~/lib/utils/inputHelpers";
import { Constants } from "~/lib/constants";
import { User, Pencil, Save, X, LogOut } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile" },
    {
      name: "description",
      content: "Manage your profile information",
    },
  ];
}

interface ProfileFormData {
  name: string;
  email: string;
  age?: number;
  password?: string;
}

export default function Profile() {
  const { user, logout } = useAuthContext();
  const { updateUser, loading } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    age: undefined,
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        age: user.age,
        password: "",
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    let processedValue: string | number | undefined = value;

    if (field === "age") {
      processedValue = value ? parseInt(value) : undefined;
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    // Validate email
    const emailResult = validateInput("email", formData.email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.error!;
    }

    // Validate password if provided
    if (formData.password && formData.password.trim() !== "") {
      const passwordResult = validateInput("password", formData.password);
      if (!passwordResult.isValid) {
        newErrors.password = passwordResult.error!;
      }
    }

    // Validate age (optional)
    if (
      formData.age !== undefined &&
      (formData.age <= 0 || formData.age > 150)
    ) {
      newErrors.age = "Age must be between 1 and 150";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !user) {
      return;
    }

    setIsLoading(true);
    try {
      const updateData: any = {
        name: normalizeInput(formData.name),
        email: normalizeInput(formData.email),
        age: formData.age,
      };

      // Only include password if it's provided
      if (formData.password && formData.password.trim() !== "") {
        updateData.password = formData.password;
      }

      const result = await updateUser(user.id, updateData);

      if (result.user) {
        setIsEditing(false);
        setFormData((prev) => ({ ...prev, password: "" })); // Clear password field
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        age: user.age,
        password: "",
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = Constants.Routes.LOGIN();
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-800"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-4 justify-between md:flex-row mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
                <User className="text-violet-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-600">Manage your account information</p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 bg-indigo-100 border border-indigo-300 text-sky-800 rounded-lg hover:bg-indigo-200 transition-colors cursor-pointer"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 bg-red-100 border border-red-300 text-rose-800 rounded-lg hover:bg-red-200 transition-colors cursor-pointer"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 bg-emerald-100 border border-emerald-300 text-green-800 rounded-lg hover:bg-emerald-200 transition-colors cursor-pointer"
                  >
                    <Save size={16} />
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 bg-gray-100 border border-gray-300 text-gray-800 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <Input
              variant="name"
              name="name"
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
              disabled={!isEditing}
              required
            />

            <Input
              variant="email"
              name="email"
              label="Email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              disabled={!isEditing}
              required
            />

            <Input
              variant="age"
              name="age"
              label="Age (optional)"
              value={formData.age?.toString() || ""}
              onChange={(e) => handleInputChange("age", e.target.value)}
              error={errors.age}
              disabled={!isEditing}
            />

            {isEditing && (
              <div className="space-y-2">
                <Input
                  variant="password"
                  name="password"
                  label="New Password (optional)"
                  placeholder="Leave blank to keep current password"
                  value={formData.password || ""}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  error={errors.password}
                />
                <p className="text-sm text-gray-500">
                  Only enter a password if you want to change it
                </p>
              </div>
            )}
          </div>

          {/* Account Info */}
          {!isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">User ID:</span>
                  <span className="ml-2 text-gray-900">{user.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Account Type:
                  </span>
                  <span className="ml-2 text-gray-900">Standard User</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
