import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import {
  setPaymentStatus,
  setOrderId,
  clearCart,
} from "@/store/slices/cartSlice";
import { addCourseToUser } from "@/store/slices/authSlice";
import {
  useProcessPayPalPaymentMutation,
  useCreatePayPalOrderMutation,
} from "@/services/api";
import {
  formatSecurePaymentData,
  validatePaymentData,
  getCourseFromCart,
  formatItemsForPayPal,
} from "@/services/paypalService";

const PayPalCheckoutForm = ({ cartTotal, cartItems, billingInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processPayPalPayment] = useProcessPayPalPaymentMutation();
  const [createPayPalOrder] = useCreatePayPalOrderMutation();

  // Get user from Redux
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // PayPal options
  const paypalOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "GBP",
    intent: "capture",
    "enable-funding": "paypal",
    "disable-funding": "credit,card",
  };

  const createOrder = async (data, actions) => {
    try {
      // Authentication check
      if (!isAuthenticated || !user?.id) {
        toast.error("Please log in to make a purchase");
        navigate("/login");
        throw new Error("User not authenticated");
      }

      // Get single course (since system only supports single course)
      const course = getCourseFromCart(cartItems);
      if (!course) {
        throw new Error("No course in cart");
      }

      console.log("🔍 PayPal Order Creation Debug:");
      console.log("  User ID:", user.id, "Type:", typeof user.id);
      console.log("  Course ID:", course.id, "Type:", typeof course.id);
      console.log("  Cart Total:", cartTotal);

      // Validate ObjectId formats if using MongoDB
      const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
      console.log("  User ID valid ObjectId:", isValidObjectId(user.id));
      console.log("  Course ID valid ObjectId:", isValidObjectId(course.id));

      // Create PayPal Order via backend
      const result = await createPayPalOrder({ courseId: course.id }).unwrap();

      console.log("✅ Backend created PayPal order:", result);
      return result.orderId;
    } catch (error) {
      console.error("PayPal createOrder error:", error);
      toast.error("Failed to create PayPal order");
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    // Prevent duplicate processing
    if (isProcessing) {
      toast.warning("Payment is already being processed...");
      return;
    }

    setIsProcessing(true);

    try {
      // Additional auth check before payment
      if (!isAuthenticated || !user?.id) {
        toast.error("Authentication lost. Please log in again.");
        navigate("/login");
        return;
      }

      // Get the course before payment processing
      const course = getCourseFromCart(cartItems);
      if (!course) {
        throw new Error("No course found in cart");
      }

      // Capture the payment
      const orderData = await actions.order.capture();

      console.log("✅ PayPal Payment Captured:", orderData);
      console.log("📦 Order ID:", data.orderID);
      console.log("💳 Payment ID:", orderData.id);

      // Format secure payment data using our service
      const securePaymentData = formatSecurePaymentData(
        cartItems,
        { id: data.orderID }, // PayPal order data
        orderData, // PayPal payment data
        billingInfo
      );

      console.log("📤 Sending secure data to backend:", securePaymentData);

      // Validate payment data before sending
      const validation = validatePaymentData(securePaymentData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // Send to secure backend endpoint
      const response = await processPayPalPayment(securePaymentData).unwrap();

      console.log("✅ Backend response:", response);

      // Success handling
      console.log("🎯 Starting success handling...");
      dispatch(setPaymentStatus("success"));
      dispatch(setOrderId(response.order_id));
      dispatch(clearCart());

      // Update user's course array in Redux
      dispatch(
        addCourseToUser({
          id: course.id,
          name: course.name,
        })
      );

      toast.success("Payment successful! Course access granted.");

      // Guard: Check for valid order_id before navigating
      if (!response.order_id) {
        toast.error("Order processing failed. Please contact support.");
        console.error("❌ No order_id in backend response:", response);
        setIsProcessingPayment(false);
        return;
      }

      console.log(
        "🚀 About to navigate to:",
        `/order-confirmation/${response.order_id}`
      );
      console.log("🎁 Navigation state:", {
        orderDetails: {
          order_id: response.order_id,
          payment_method: "PayPal",
        },
        course: course,
      });

      // Use window.location for reliable navigation (this worked before)
      console.log("🔄 Using window.location navigation...");
      window.location.href = `/order-confirmation/${response.order_id}`;

      console.log("✅ Navigation called successfully!");
    } catch (error) {
      console.error("❌ Payment processing error:", error);

      // Enhanced error handling
      let errorMessage = "Payment failed. Please try again.";

      if (error.status === 400) {
        errorMessage = error.message || "Payment validation failed";
      } else if (error.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
      } else if (error.status === 403) {
        errorMessage =
          "Payment authorization failed. Please try again or contact support.";
      } else if (error.status === 409) {
        errorMessage = "Payment already processed or duplicate transaction";
      } else if (error.error_code === "PAYMENT_VERIFICATION_FAILED") {
        errorMessage = "Payment verification failed. Please contact support.";
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }

      toast.error(errorMessage);
      dispatch(setPaymentStatus("failed"));

      // Redirect to login if authentication failed
      if (error.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err) => {
    console.error("❌ PayPal error:", err);
    toast.error("PayPal payment failed. Please try again.");
    dispatch(setPaymentStatus("failed"));
    setIsProcessing(false);
  };

  const onCancel = () => {
    console.log("🚫 PayPal payment cancelled");
    toast.info("Payment cancelled");
    setIsProcessing(false);
  };

  // Get current course for display
  const currentCourse = getCourseFromCart(cartItems);

  // Show warning if not authenticated
  if (!isAuthenticated || !user?.id) {
    return (
      <div className="paypal-checkout-form">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            ⚠️ Please log in to complete your purchase.
          </p>
        </div>
      </div>
    );
  }

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
          disabled={isProcessing || !currentCourse || !isAuthenticated}
        />
      </PayPalScriptProvider>

      {isProcessing && (
        <div className="text-center mt-2">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-sm text-gray-500">
              Processing payment securely...
            </p>
          </div>
        </div>
      )}

      {/* Development info */}
      {import.meta.env.DEV && currentCourse && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <p>
            <strong>🧪 Development Mode</strong>
          </p>
          <p>Course: {currentCourse.name}</p>
          <p>Price: £{cartTotal}</p>
          <p>User ID: {user?.id}</p>
          <p>Course ID: {currentCourse.id}</p>
          <p>
            PayPal:{" "}
            {paypalOptions.clientId ? "Configured" : "❌ Missing Client ID"}
          </p>
          <p>Auth: {isAuthenticated ? "✅ Logged in" : "❌ Not logged in"}</p>

          {/* TEST NAVIGATION BUTTON */}
          <button
            onClick={() => {
              console.log("🧪 Testing navigation...");
              navigate("/courses/success", {
                state: {
                  paymentIntent: { id: "TEST123" },
                  orderDetails: { id: "TEST123", amount: cartTotal },
                  course: currentCourse,
                  paymentMethod: "paypal",
                },
              });
            }}
            className="mt-2 px-2 py-1 bg-red-200 text-red-800 rounded text-xs"
          >
            TEST NAVIGATION
          </button>
        </div>
      )}

      {/* Error if no course */}
      {!currentCourse && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
          ⚠️ No course in cart. Please add a course before payment.
        </div>
      )}
    </div>
  );
};

export default PayPalCheckoutForm;
