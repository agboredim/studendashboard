import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Show toast notification when redirecting to login
    // toast.info("Please log in to access this page");

    // Redirect to login page with the location they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
