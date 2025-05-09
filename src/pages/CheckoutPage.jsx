"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

// Components
import { Card } from "@/components/ui/card";
import CheckoutProtection from "@/components/CheckoutProtection";

// Redux
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
  setPaymentStatus,
  setOrderId,
} from "@/store/slices/cartSlice";

// API
import {
  useCreateOrderMutation,
  useProcessPayPalPaymentMutation,
} from "@/services/api";

// Services
import {
  formatItemsForPayPal,
  calculateOrderTotal,
  formatOrderForBackend,
} from "@/services/paypalService";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalOrderId, setPaypalOrderId] = useState(null);

  // RTK Query mutations
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [processPayPalPayment, { isLoading: isProcessingPayment }] =
    useProcessPayPalPaymentMutation();

  // PayPal configuration
  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "GBP",
    intent: "capture",
  };

  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      navigate("/courses");
      toast.info("Your cart is empty. Please add courses to checkout.");
    }
  }, [cartItems, navigate]);

  const handlePayPalCreateOrder = async () => {
    try {
      const items = formatItemsForPayPal(cartItems);
      const orderTotal = calculateOrderTotal(cartItems);

      // This would typically be handled by your backend
      // For client-side demo purposes only
      return {
        purchase_units: [
          {
            amount: {
              currency_code: "GBP",
              value: orderTotal,
              breakdown: {
                item_total: {
                  currency_code: "GBP",
                  value: orderTotal,
                },
              },
            },
            items: items,
          },
        ],
      };
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      toast.error("Failed to create order. Please try again.");
      return null;
    }
  };

  const handlePayPalApprove = async (data, actions) => {
    setIsProcessing(true);
    try {
      // Capture the funds from the transaction
      const paypalOrderData = data;
      const paypalPaymentData = await actions.order.capture();

      // Save the PayPal order ID
      setPaypalOrderId(paypalOrderData.orderID);

      // Format order data for backend
      const orderData = formatOrderForBackend(
        cartItems,
        { id: paypalOrderData.orderID },
        paypalPaymentData
      );

      // Process payment on backend
      const response = await processPayPalPayment(orderData).unwrap();

      // Update Redux state
      dispatch(setPaymentStatus("success"));
      dispatch(setOrderId(response.order_id));
      dispatch(clearCart());

      // Redirect to confirmation page
      toast.success("Payment successful! Thank you for your purchase.");
      navigate(`/order-confirmation/${response.order_id}`);
    } catch (error) {
      console.error("Error processing PayPal payment:", error);
      dispatch(setPaymentStatus("failed"));
      toast.error(error.data?.detail || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalError = (error) => {
    console.error("PayPal error:", error);
    toast.error(
      "Payment failed. Please try again or use a different payment method."
    );
    dispatch(setPaymentStatus("failed"));
  };

  return (
    <CheckoutProtection>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b pb-4"
                    >
                      <div className="flex items-center">
                        <img
                          src={
                            item.image || "/placeholder.svg?height=60&width=60"
                          }
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">£{item.price?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Your cart is empty.</p>
              )}
            </Card>
          </div>

          {/* Payment Section */}
          <div className="md:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>

              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span>Subtotal:</span>
                  <span>£{cartTotal}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>£{cartTotal}</span>
                </div>

                {/* PayPal Button */}
                <div className="mt-6">
                  <PayPalScriptProvider options={paypalOptions}>
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        return actions.order.create(handlePayPalCreateOrder());
                      }}
                      onApprove={handlePayPalApprove}
                      onError={handlePayPalError}
                      disabled={
                        isProcessing || isCreatingOrder || isProcessingPayment
                      }
                    />
                  </PayPalScriptProvider>
                </div>

                {(isProcessing || isCreatingOrder || isProcessingPayment) && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                      Processing your payment, please wait...
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </CheckoutProtection>
  );
};

export default CheckoutPage;
