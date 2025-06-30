import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "../store/slices/cartSlice";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../store/slices/authSlice";

function AddToCartButton({ course }) {
  const [isAdded, setIsAdded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  // Auth state
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Check if the course is already in the cart
  const isInCart = cartItems.some((item) => item.id === course.id);

  // Check if user is already enrolled
  const isAlreadyEnrolled =
    isAuthenticated &&
    user &&
    Array.isArray(user.course) &&
    user.course.some(
      (enrolledCourse) =>
        enrolledCourse &&
        String(enrolledCourse?.id ?? enrolledCourse) === String(course.id)
    );

  const handleAddToCart = () => {
    // Cart-level protection: prevent enrolled users from adding to cart
    if (isAlreadyEnrolled) {
      alert(
        "You're already enrolled in this course! Redirecting to your portal..."
      );
      navigate("/portal");
      return;
    }

    if (isInCart) {
      navigate("/checkout");
      return;
    }

    dispatch(
      addToCart({
        id: course.id,
        name: course.name,
        image: course.course_image,
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
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-primary text-white hover:bg-primary/90"
      }`}
      disabled={isAlreadyEnrolled}
      aria-disabled={isAlreadyEnrolled}
      tabIndex={isAlreadyEnrolled ? -1 : 0}
    >
      {isAlreadyEnrolled ? (
        <>
          <Check className="h-5 w-5" />
          Already Enrolled
        </>
      ) : isAdded || isInCart ? (
        <>
          <Check className="h-5 w-5" />
          {isInCart ? "Go to Checkout" : "Added to Cart"}
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </>
      )}
    </Button>
  );
}

export default AddToCartButton;
