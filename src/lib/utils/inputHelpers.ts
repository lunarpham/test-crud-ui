export const normalizeInput = (input: string): string => {
  if (!input) return "";

  const collapsed = input.replace(/\s{2,}/g, " ");
  return collapsed.trim();
};

export const validateEmail = (
  email: string
): { isValid: boolean; error?: string } => {
  const normalized = normalizeInput(email);

  if (!normalized) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(normalized)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
};

export const validatePassword = (
  password: string
): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 8 || password.length > 20) {
    return {
      isValid: false,
      error: "Password must be between 8 and 20 characters",
    };
  }

  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/;
  if (!passwordRegex.test(password)) {
    return { isValid: false, error: "Password contains invalid characters" };
  }

  return { isValid: true };
};

export const validateInput = (
  type: "email" | "password" | "text",
  value: string
): { value: string; isValid: boolean; error?: string } => {
  switch (type) {
    case "email":
      const normalizedEmail = normalizeInput(value);
      const emailValidation = validateEmail(normalizedEmail);
      return { ...emailValidation, value: normalizedEmail };

    case "password":
      const passwordValidation = validatePassword(value);
      return { ...passwordValidation, value };

    case "text":
      const normalizedText = normalizeInput(value);
      return { isValid: true, value: normalizedText };

    default:
      return {
        isValid: false,
        value: normalizeInput(value),
        error: "Unknown input type",
      };
  }
};
