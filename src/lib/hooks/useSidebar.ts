import { useLocation } from "react-router";
import { Constants } from "~/lib/constants";

export function sidebarVisibility() {
  const location = useLocation();

  const dashboardRoutes = [
    Constants.Routes.DASHBOARD(),
    Constants.Routes.PROJECTS(),
    Constants.Routes.USERS(),
    Constants.Routes.PROFILE(),
  ];

  const showSidebar = dashboardRoutes.includes(location.pathname);

  return { showSidebar, currentPath: location.pathname };
}
