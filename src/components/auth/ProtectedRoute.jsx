import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export const roleHome = (role) => role === "admin" ? "/admin/dashboard" : role === "vendor" ? "/vendor/dashboard" : "/user/dashboard";

export const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50" aria-live="polite">Loading your account…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to={roleHome(user.role)} replace />;
  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to={roleHome(user.role)} replace /> : <Outlet />;
};
