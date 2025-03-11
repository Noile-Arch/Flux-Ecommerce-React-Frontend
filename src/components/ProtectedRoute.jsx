import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import PropTypes from "prop-types";

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token } = useAuth();
  const location = useLocation();

//   console.log("ProtectedRoute - user:", user, "token:", token);

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (adminOnly && !user?.is_admin) {
    return <Navigate to="/home" replace />;
  }

  return children || <Outlet />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  adminOnly: PropTypes.bool
}; 