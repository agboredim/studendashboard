import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import {
  setPaymentStatus,
  setOrderId,
  clearCart,
} from "@/store/slices/cartSlice";
import { useProcessPayPalPaymentMutation } from "@/services/api";

const PayPalCheckoutForm = ({ cartTotal, cartItems, billingInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processPayPalPayment] = useProcessPayPalPaymentMutation();

  // PayPal options
  const paypalOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "GBP",
    intent: "capture",
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: cartTotal,
            currency_code: "GBP",
          },
          description: `Purchase of ${cartItems.length} course(s)`,
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  };

  const onApprove = async (data, actions) => {
    try {
      setIsProcessing(true);
      const order = await actions.order.capture();

      // Send the completed payment to backend with correct format
      const response = await processPayPalPayment({
        paypal_order_id: data.orderID, // Changed from 'id' to 'paypal_order_id'
        payment_details: order,
        items: cartItems.map((item) => ({
          course_id: item.id,
          name: item.name,
          price: item.price,
        })),
        billing_info: billingInfo,
      }).unwrap();

      dispatch(setPaymentStatus("success"));
      dispatch(setOrderId(response.order_id));
      dispatch(clearCart());

      toast.success("Payment successful!");
      navigate(`/order-confirmation/${response.order_id}`);
    } catch (error) {
      console.error("Payment processing error:", error);
      const errorMessage =
        error.data?.message || "Payment failed. Please try again.";
      toast.error(errorMessage);
      dispatch(setPaymentStatus("failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    toast.error("Payment failed. Please try again.");
    dispatch(setPaymentStatus("failed"));
    setIsProcessing(false);
  };

  const onCancel = () => {
    toast.info("Payment cancelled");
    setIsProcessing(false);
  };

  return (
    <div className="paypal-checkout-form">
      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 45,
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          onCancel={onCancel}
          disabled={isProcessing}
        />
      </PayPalScriptProvider>

      {isProcessing && (
        <div className="text-center mt-2">
          <p className="text-sm text-gray-500">Processing payment...</p>
        </div>
      )}
    </div>
  );
};

export default PayPalCheckoutForm;
