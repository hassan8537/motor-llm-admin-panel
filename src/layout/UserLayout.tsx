// Updated UserLayout.tsx with authentication checks
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { authUtils } from "../utils/auth";
import Backdrop from "./Backdrop";
import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const navigate = useNavigate();

  // Periodic authentication check
  useEffect(() => {
    const checkAuth = () => {
      if (!authUtils.isAuthenticated() || authUtils.isTokenExpired()) {
        authUtils.clearAuth();
        navigate("/signin", { replace: true });
      }
    };

    // Check immediately
    checkAuth();

    // Check every 5 minutes
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authToken" || e.key === "user") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <UserSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <UserHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const UserLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default UserLayout;
