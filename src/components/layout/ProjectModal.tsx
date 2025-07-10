import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { Project } from "~/lib/hooks/useProject";
import { User } from "~/lib/types/userTypes";
import { normalizeInput } from "~/lib/utils/inputHelpers";
import { X, Check } from "lucide-react";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: ProjectFormData) => Promise<void>;
  project?: Project | null;
  title: string;
  users: User[];
  isLoading?: boolean;
}

export interface ProjectFormData {
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  userId: string[];
}

export default function ProjectFormModal({
  isOpen,
  onClose,
  onSubmit,
  project,
  title,
  users,
  isLoading = false,
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    status: "pending",
    userId: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const isEditMode = !!project;

  // Reset form when modal opens/closes or project changes
  useEffect(() => {
    if (isOpen) {
      if (project) {
        setFormData({
          title: project.title || "",
          description: project.description || "",
          status: project.status || "pending",
          userId: project.users.map((user) => user.id),
        });
        setSelectedUsers(project.users);
      } else {
        setFormData({
          title: "",
          description: "",
          status: "pending",
          userId: [],
        });
        setSelectedUsers([]);
      }
      setErrors({});
      setServerError("");
    }
  }, [isOpen, project]);

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleStatusChange = (status: string) => {
    setFormData((prev) => ({
      ...prev,
      status: status as "pending" | "in_progress" | "completed",
    }));

    if (errors.status) {
      setErrors((prev) => ({ ...prev, status: "" }));
    }
  };

  const handleUserToggle = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const isSelected = selectedUsers.some((u) => u.id === userId);

    if (isSelected) {
      // Remove user
      setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
      setFormData((prev) => ({
        ...prev,
        userId: prev.userId.filter((id) => id !== userId),
      }));
    } else {
      // Add user
      setSelectedUsers([...selectedUsers, user]);
      setFormData((prev) => ({
        ...prev,
        userId: [...prev.userId, userId],
      }));
    }

    if (errors.userId) {
      setErrors((prev) => ({ ...prev, userId: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation for required fields
    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Title is required";
    }

    // Validate that at least one user is selected
    if (formData.userId.length === 0) {
      newErrors.userId = "At least one project member must be selected";
    }

    // Validate that all user IDs are valid positive integers
    const hasInvalidId = formData.userId.some((id) => {
      const numId = parseInt(id, 10);
      return isNaN(numId) || numId <= 0;
    });

    if (hasInvalidId) {
      newErrors.userId = "All user IDs must be valid positive integers";
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

    // Normalize text fields before submission
    const normalizedFormData: ProjectFormData = {
      title: normalizeInput(formData.title),
      description: normalizeInput(formData.description),
      status: formData.status,
      userId: formData.userId,
    };

    await onSubmit(normalizedFormData);
    onClose();
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <Input
          variant="default"
          name="title"
          label="Project Title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          error={errors.title}
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full p-4 bg-neutral-100 rounded-lg border-2 border-violet-100 focus:outline-none focus:border-violet-300"
            rows={3}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Select
            options={statusOptions}
            value={formData.status}
            onChange={handleStatusChange}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Members
          </label>
          {errors.userId && (
            <div className="mt-1 mb-2 flex items-center">
              <span className="text-red-500 text-xs">{errors.userId}</span>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
            {users.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">
                No users available
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center p-2 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={selectedUsers.some((u) => u.id === user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="h-4 w-4 text-violet-600 rounded border-gray-300"
                  />
                  <label
                    htmlFor={`user-${user.id}`}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {user.name} ({user.email})
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

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
              ? "Update Project"
              : "Create Project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
