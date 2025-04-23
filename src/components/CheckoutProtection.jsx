import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// This component specifically checks if the cart has items
// It complements ProtectedRoute which handles authentication
const CheckoutProtection = ({ children }) => {
  const location = useLocation();
  const { items } = useSelector((state) => state.cart);

  // Check if cart is empty
  if (items.length === 0) {
    toast.info(
      "Your cart is empty. Please add items before proceeding to checkout."
    );
    return <Navigate to="/courses" state={{ from: location }} replace />;
  }

  return children;
};

export default CheckoutProtection;
