import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function CartIcon() {
  const cartItems = useSelector((state) => state.cart.items);
  const itemCount = cartItems.length;

  return (
    <Link to="/checkout" className="relative flex items-center">
      <ShoppingCart className="h-5 w-5 text-primary hover:text-secondary transition-colors duration-300" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

export default CartIcon;
