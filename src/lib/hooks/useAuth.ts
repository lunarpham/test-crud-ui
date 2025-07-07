import { useEffect, useState } from "react";
import axios from "../api/axios";
import { User } from "../types/userTypes";

type AuthResponse = {
  user: User;
  token: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    age?: number
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
};

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      const response = await axios.get<AuthResponse>("/auth/me");
      const { user: authUser, token: authToken } = response.data;
      setUser(authUser);
      setIsAuthenticated(true);
      localStorage.setItem("auth_token", authToken);
    } catch (error) {
      console.error("Error checking authentication:", error);
      localStorage.removeItem("auth_token");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      const { user: authUser, token: authToken } = response.data;
      setUser(authUser);
      setIsAuthenticated(true);
      localStorage.setItem("auth_token", authToken);

      // The AuthProvider will handle the redirect based on stored path
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (
    name: string,
    email: string,
    password: string,
    age?: number
  ): Promise<void> => {
    try {
      setIsLoading(true);
      await axios.post<AuthResponse>("/auth/register", {
        name,
        email,
        password,
        age,
      });
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = (): void => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  };
}
