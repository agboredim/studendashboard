"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { Trash2, ShieldCheck, Award, Clock } from "lucide-react";

// Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CheckoutProtection from "@/components/CheckoutProtection";

// Redux
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
  removeFromCart,
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

const baseUrl = import.meta.env.VITE_BASE_URL;

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalOrderId, setPaypalOrderId] = useState(null);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United Kingdom",
  });

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
      console.info("cart is empty. Please add courses to checkout.");
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
    // console.info("Item removed from cart");
    navigate("/courses");
  };

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

      // Add billing information to the order data
      orderData.billing_info = billingInfo;

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
          {/* Left Column - Billing Information and Order Summary */}
          <div className="md:col-span-2">
            {/* Billing Information - Now First */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Billing Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={billingInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={billingInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={billingInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={billingInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={billingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={billingInfo.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={billingInfo.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="Italy">Italy</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Belgium">Belgium</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Order Summary - Now Second */}
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
                          src={`${baseUrl}${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <p className="font-semibold mr-4">
                          £{item.price?.toFixed(2)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Your cart is empty.</p>
              )}
            </Card>
          </div>

          {/* Right Column - Payment Section */}
          <div className="md:col-span-1">
            <Card className="p-6 mb-8">
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

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Secure Checkout</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">
                    Your payment information is secure and encrypted
                  </span>
                </li>
                <li className="flex items-start">
                  <Award className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">100% satisfaction guarantee</span>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Instant access after payment</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="mt-16 mb-8">
          <h2 className="text-xl font-semibold text-center mb-8">
            Trusted By Industry Leaders
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Company 1"
              className="h-10 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
            />
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Company 2"
              className="h-10 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
            />
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Company 3"
              className="h-10 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
            />
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Company 4"
              className="h-10 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
            />
            <img
              src="/placeholder.svg?height=40&width=120"
              alt="Company 5"
              className="h-10 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
            />
          </div>
        </div>
      </div>
    </CheckoutProtection>
  );
};

export default CheckoutPage;
