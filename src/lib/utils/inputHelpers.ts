export const normalizeInput = (input: string): string => {
  if (!input) return "";

  // First trim the input
  const trimmed = input.trim();

  // Replace multiple spaces with a single space
  return trimmed.replace(/\s+/g, " ");
};

export const validateEmail = (
  email: string
): { isValid: boolean; error?: string } => {
  const normalized = normalizeInput(email);

  if (!normalized) {
    return { isValid: false, error: "Email is required" };
  }

  // RFC 5322 compliant email regex
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

  // Check for allowed characters (alphanumeric and common symbols)
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
  const normalizedValue = normalizeInput(value);

  switch (type) {
    case "email":
      const emailValidation = validateEmail(normalizedValue);
      return { ...emailValidation, value: normalizedValue };

    case "password":
      const passwordValidation = validatePassword(value); // Don't normalize passwords
      return { ...passwordValidation, value }; // Return original password to preserve spaces

    case "text":
      return { isValid: true, value: normalizedValue };

    default:
      return {
        isValid: false,
        value: normalizedValue,
        error: "Unknown input type",
      };
  }
};
