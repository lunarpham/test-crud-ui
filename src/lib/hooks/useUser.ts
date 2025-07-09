import { useState, useEffect, useCallback } from "react";
import axios from "../api/axios";
import { User } from "../types/userTypes";
import { handleApiError, showSuccess } from "../utils/errorHandler";

// Types for request data
interface CreateUserData {
  name: string;
  email: string;
  password: string;
  age?: number;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  age?: number;
}

export function useUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Get all users
  const getUsers = useCallback(async (): Promise<User[] | null> => {
    setLoading(true);
    clearErrors();
    try {
      const response = await axios.get<User[]>("/users");
      const fetchedUsers = response.data;
      setUsers(fetchedUsers);
      return fetchedUsers;
    } catch (error: any) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user by ID
  const getUserById = async (id: number | string): Promise<User | null> => {
    setLoading(true);
    clearErrors();
    try {
      const response = await axios.get<User>(`/users/${id}`);
      const fetchedUser = response.data;
      setSelectedUser(fetchedUser);
      return fetchedUser;
    } catch (error: any) {
      handleApiError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create new user
  const createUser = async (
    userData: CreateUserData
  ): Promise<{ user: User | null; error?: string }> => {
    setLoading(true);
    clearErrors();
    try {
      const response = await axios.post<User>("/users", userData);
      showSuccess("User created successfully!");
      return { user: response.data };
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (
    id: number | string,
    userData: UpdateUserData
  ): Promise<{ user: User | null; error?: string }> => {
    setLoading(true);
    clearErrors();
    try {
      const response = await axios.put<User>(`/users/${id}`, userData);
      showSuccess("User updated successfully!");
      return { user: response.data };
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id: number | string): Promise<boolean> => {
    setLoading(true);
    clearErrors();
    try {
      await axios.delete(`/users/${id}`);
      // After successful deletion, filter out the user from state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      showSuccess("User deleted successfully!");
      return true;
    } catch (error: any) {
      handleApiError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear validation errors only (toast errors are handled by errorHandler)
  const clearErrors = (): void => {
    setValidationErrors([]);
  };

  // Load users on initial mount
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return {
    users,
    selectedUser,
    loading,
    validationErrors,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    clearErrors,
  };
}
