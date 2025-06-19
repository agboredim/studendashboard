import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  setPaymentStatus,
  setOrderId,
  clearCart,
} from "@/store/slices/cartSlice";

const StripeCheckoutForm = ({
  clientSecret,
  cartTotal,
  cartItems,
  billingInfo,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
        payment_method_data: {
          billing_details: {
            name: `${billingInfo.firstName} ${billingInfo.lastName}`,
            email: billingInfo.email,
            address: {
              line1: billingInfo.address,
              city: billingInfo.city,
              postal_code: billingInfo.postalCode,
              country: billingInfo.country,
            },
          },
        },
      },
      redirect: "if_required", // Prevent automatic redirection
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
      toast.error(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
      return;
    }

    // Payment succeeded
    if (paymentIntent && paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      dispatch(setPaymentStatus("success"));
      dispatch(setOrderId(paymentIntent.id));
      dispatch(clearCart());
      navigate(
        `/order-confirmation?payment_intent=${paymentIntent.id}&redirect_status=succeeded`
      );
    } else {
      setMessage("Payment did not succeed. Please try again.");
      toast.error("Payment did not succeed. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <form
      id="stripe-payment-form"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <PaymentElement
        id="payment-element"
        options={{
          layout: "tabs",
        }}
      />

      <Button
        disabled={isProcessing || !stripe || !elements}
        type="submit"
        className="w-full"
      >
        <span id="button-text">
          {isProcessing ? "Processing..." : `Pay £${cartTotal?.toFixed(2)}`}
        </span>
      </Button>

      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className="text-red-500 text-sm text-center">
          {message}
        </div>
      )}
    </form>
  );
};

export default StripeCheckoutForm;
