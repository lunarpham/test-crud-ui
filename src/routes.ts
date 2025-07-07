import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { Constants } from "./lib/constants";

export default [
  index("pages/Dashboard.tsx"),
  route(`${Constants.Routes.USERS()}`, "pages/Users.tsx"),
  route(`${Constants.Routes.PROJECTS()}`, "pages/Projects.tsx"),
  route(`${Constants.Routes.PROFILE()}`, "pages/Profile.tsx"),
  route(`${Constants.Routes.LOGIN()}`, "auth/Login.tsx"),
  route(`${Constants.Routes.REGISTER()}`, "auth/Register.tsx"),
] satisfies RouteConfig;
