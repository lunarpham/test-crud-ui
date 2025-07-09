import toast from "react-hot-toast";
import { AxiosError } from "axios";

export function handleApiError(error: unknown): string {
  console.error(error);

  // Axios error handling
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // Handle specific status codes
    switch (status) {
      case 401:
        toast.error("Authentication error. Please log in again.");
        return "Authentication error";
      case 403:
        toast.error("You do not have permission to perform this action");
        return "Permission denied";
      case 404:
        toast.error("Resource not found");
        return "Not found";
      case 422:
        toast.error("Validation failed. Please check your input.");
        return "Validation error";
      case 429:
        toast.error("Too many requests. Please try again later.");
        return "Rate limited";
      case 500:
      case 502:
      case 503:
        toast.error("Server error. Please try again later.");
        return "Server error";
      default:
        toast.error(message || "An unexpected error occurred");
        return message || "Unexpected error";
    }
  }

  // Generic error handling
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";
  toast.error(errorMessage);
  return errorMessage;
}

export function showSuccess(message: string): void {
  toast.success(message);
}
