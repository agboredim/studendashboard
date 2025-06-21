import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// import { useDispatch } from "react-redux";
// import { clearCart } from "@/store/slices/cartSlice";
import { useState } from "react";

// Convert country name to ISO 3166-1 alpha-2 code
const convertCountryToCode = (country) => {
  const countryCodes = {
    "United Kingdom": "GB",
    "United States": "US",
    Canada: "CA",
    Australia: "AU",
    Germany: "DE",
    France: "FR",
    Spain: "ES",
    Italy: "IT",
    // Add more mappings as needed
  };
  return countryCodes[country] || "GB"; // Default to GB if not found
};

const StripeCheckoutForm = ({
  clientSecret,
  cartTotal,
  cartItems,
  billingInfo,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret || isSubmitting) return;

    setIsSubmitting(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card input not found. Please refresh.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${billingInfo.firstName} ${billingInfo.lastName}`,
              email: billingInfo.email,
              address: {
                line1: billingInfo.address,
                city: billingInfo.city,
                postal_code: billingInfo.postalCode,
                country: convertCountryToCode(billingInfo.country),
              },
            },
          },
        }
      );
      console.log("Payment Intent:", paymentIntent);

      if (error) {
        toast.error(error.message || "Payment failed");
        console.error("Payment error:", error);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        navigate("/courses/success", {
          state: {
            paymentIntent: paymentIntent,
            orderDetails: {
              id: paymentIntent.id,
              amount: cartTotal,
              created_at: new Date(
                paymentIntent.created * 1000
              ).toLocaleString(),
            },
            billingInfo: billingInfo,
            course: cartItems[0],
            paymentMethod: "stripe",
          },
        });
        // dispatch(clearCart());
      } else {
        toast.error("Payment was not completed. Please try again.");
      }
    } catch (err) {
      console.error("Unexpected error during payment:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{
          hidePostalCode: true,
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": { color: "#a0aec0" },
            },
            invalid: { color: "#e53e3e" },
          },
        }}
      />
      <button
        type="submit"
        className="w-full mt-4 px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
        disabled={!stripe || isSubmitting}
      >
        {isSubmitting ? "Processing..." : `Pay £${cartTotal}`}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
