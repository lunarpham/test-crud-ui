import toast from "react-hot-toast";
import { AxiosError } from "axios";

export function handleApiError(error: unknown): string {
  console.error(error);

  // Axios error handling
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    switch (status) {
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
