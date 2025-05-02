import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "../store/slices/cartSlice";

function AddToCartButton({ course }) {
  const [isAdded, setIsAdded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  // Check if the course is already in the cart
  const isInCart = cartItems.some((item) => item.id === course.id);

  const handleAddToCart = () => {
    if (isInCart) {
      navigate("/checkout");
      return;
    }

    dispatch(
      addToCart({
        id: course.id,
        // Assuming course object has a 'name' property for the cart
        // If it's 'title' as in the previous component, use course.title
        name: course.name,
        price: course.price,
        quantity: 1,
      })
    );

    setIsAdded(true);

    // Reset the button after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={`flex items-center gap-2 ${
        isInCart
          ? "bg-green-600 text-white hover:bg-green-700" // Keeping green for clarity when item is in cart
          : // Using primary color for 'Add to Cart' state
            "bg-primary text-white hover:bg-primary/90"
      }`}
    >
      {isAdded || isInCart ? (
        <>
          {/* Icons will inherit text color */}
          <Check className="h-5 w-5" />
          {isInCart ? "Go to Checkout" : "Added to Cart"}
        </>
      ) : (
        <>
          {/* Icons will inherit text color */}
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </>
      )}
    </Button>
  );
}

export default AddToCartButton;
