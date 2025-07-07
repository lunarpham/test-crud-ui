import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth, AuthContextType } from "../hooks/useAuth";
import { Constants } from "../constants";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await auth.checkAuth();
      setIsInitialized(true);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const protectedRoutes = [
      Constants.Routes.DASHBOARD(),
      Constants.Routes.PROJECTS(),
      Constants.Routes.USERS(),
      Constants.Routes.PROFILE(),
    ];

    const authRoutes = [Constants.Routes.LOGIN(), Constants.Routes.REGISTER()];

    const isProtectedRoute = protectedRoutes.includes(location.pathname);
    const isAuthRoute = authRoutes.includes(location.pathname);

    if (isProtectedRoute && !auth.isAuthenticated) {
      navigate(Constants.Routes.LOGIN(), { replace: true });
    } else if (isAuthRoute && auth.isAuthenticated) {
      navigate(Constants.Routes.DASHBOARD(), { replace: true });
    }
  }, [auth.isAuthenticated, location.pathname, navigate, isInitialized]);

  // Show loading spinner while checking authentication
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-800"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
