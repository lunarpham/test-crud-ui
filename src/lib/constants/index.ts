export class Constants {
  static readonly APP_NAME = "User/Project Management Dashboard";
  static readonly APP_DESCRIPTION =
    "Welcome to the User/Project Management Dashboard!";
  static readonly APP_VERSION = "1.0.0";
  static readonly API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
  static readonly Routes = {
    DASHBOARD: () => "/",
    PROJECTS: () => "/projects",
    USERS: () => "/users",
    LOGIN: () => "/login",
    REGISTER: () => "/register",
    PROFILE: () => "/profile",
  };
}
