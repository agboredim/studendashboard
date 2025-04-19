"use client";

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
        name: course.title,
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
          ? "bg-green-600 hover:bg-green-700"
          : "bg-blue-950 hover:bg-blue-900"
      }`}
    >
      {isAdded || isInCart ? (
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
