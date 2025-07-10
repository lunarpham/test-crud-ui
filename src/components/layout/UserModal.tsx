import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import { User } from "~/lib/types/userTypes";
import { validateInput, normalizeInput } from "~/lib/utils/inputHelpers";
import { X, Check } from "lucide-react";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => Promise<string | null | undefined>; // Updated return type
  user?: User | null;
  title: string;
  isLoading?: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  age?: number;
  password?: string;
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  title,
  isLoading = false,
}: UserFormModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    age: undefined,
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>("");

  const isEditMode = !!user;

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          name: user.name || "", // Fixed: removed extra space
          email: user.email || "",
          age: user.age,
          password: "", // Don't pre-fill password for editing
        });
      } else {
        setFormData({
          name: "",
          email: "",
          age: undefined,
          password: "mypassword123", // Default password for new users
        });
      }
      setErrors({});
      setServerError("");
    }
  }, [isOpen, user]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    let processedValue: string | number | undefined = value;

    if (field === "age") {
      processedValue = value ? parseInt(value) : undefined;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    const emailResult = validateInput("email", formData.email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.error!;
    }

    if (
      formData.age !== undefined &&
      (formData.age <= 0 || formData.age > 150)
    ) {
      newErrors.age = "Age must be between 1 and 150";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    const normalizedFormData: UserFormData = {
      name: normalizeInput(formData.name),
      email: normalizeInput(formData.email),
      age: formData.age,
      password: formData.password,
    };

    const error = await onSubmit(normalizedFormData);
    if (error) {
      // Check if it's an email-specific error
      if (error.includes("Email already exists") || error.includes("email")) {
        setErrors((prev) => ({ ...prev, email: error }));
      } else {
        setServerError(error);
      }
      return;
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <Input
          variant="name"
          name="name"
          label="Name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={errors.name}
          required
        />

        <Input
          variant="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          error={errors.email}
          required
        />

        <Input
          variant="age"
          name="age"
          label="Age (optional)"
          value={formData.age?.toString() || ""}
          onChange={(e) => handleInputChange("age", e.target.value)}
          error={errors.age}
        />

        {!isEditMode && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            <p className="text-sm">
              <strong>Note:</strong> New users will be assigned the default
              password: "mypassword123"
            </p>
          </div>
        )}

        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {serverError}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-sky-800 text-white rounded-lg hover:bg-sky-900 transition-colors disabled:bg-violet-400 inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check size={16} />
            {isLoading
              ? "Saving..."
              : isEditMode
              ? "Update User"
              : "Create User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
