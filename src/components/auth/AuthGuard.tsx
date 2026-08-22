import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/use-auth-store";

const AuthGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore((s) => s.state);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const location = useLocation();

  if (!hasHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--app-bg)" }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "rgb(var(--accent-070))", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children || <Outlet />}</>;
};

export default AuthGuard;
