import { useState, useEffect } from "react";
import { normalizeInput } from "~/lib/utils/inputHelpers";

interface FormHandlerOptions<T> {
  initialData: T;
  onSubmit: (data: T) => Promise<string | null | undefined>;
  onSuccess?: () => void;
  resetDependencies?: any[];
  normalizeFields?: (keyof T)[];
}

export function useFormHandler<T extends Record<string, any>>({
  initialData,
  onSubmit,
  onSuccess,
  resetDependencies = [],
  normalizeFields = [],
}: FormHandlerOptions<T>) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dependencies change
  useEffect(() => {
    setFormData(initialData);
    setErrors({});
    setServerError("");
  }, resetDependencies);

  const handleInputChange = (field: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (
    validator: (data: T) => Record<string, string>
  ): boolean => {
    const newErrors = validator(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent,
    validator: (data: T) => Record<string, string>
  ) => {
    event.preventDefault();
    setServerError("");

    if (!validateForm(validator)) {
      return;
    }

    setIsSubmitting(true);

    // Create a copy of the form data
    const normalizedData = { ...formData };

    // Normalize specified string fields
    for (const field of normalizeFields) {
      if (typeof normalizedData[field] === "string") {
        normalizedData[field] = normalizeInput(
          normalizedData[field]
        ) as T[keyof T];
      }
    }

    try {
      const error = await onSubmit(normalizedData);

      if (error) {
        setServerError(error);
        return;
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setServerError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    serverError,
    setServerError,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    validateForm,
  };
}
