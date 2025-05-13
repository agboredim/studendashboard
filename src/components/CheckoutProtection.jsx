import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const CheckoutProtection = ({ children }) => {
  const location = useLocation();
  const { items } = useSelector((state) => state.cart);

  // Check if cart is empty
  if (items.length === 0) {
    return <Navigate to="/courses" state={{ from: location }} replace />;
  }

  return children;
};

export default CheckoutProtection;
