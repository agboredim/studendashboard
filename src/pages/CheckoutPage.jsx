import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, ShieldCheck, Award, Clock, CreditCard } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CheckoutProtection from "@/components/CheckoutProtection";
import StripeCheckoutForm from "@/components/StripeCheckoutForm";
import PayPalCheckoutForm from "@/components/PayPalCheckoutForm";

// Redux
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
} from "@/store/slices/cartSlice";

// API
import { useCreateStripePaymentIntentMutation } from "@/services/api";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Initialize Stripe outside of the component to avoid re-creating the object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentDiagnostic = () => {
  const { isAuthenticated, accessToken, user } = useSelector(
    (state) => state.auth
  );
  return (
    <div className="mb-4 p-4 bg-gray-100 rounded border">
      <h3 className="font-bold mb-2">🔍 Payment Diagnostic</h3>
      <div className="space-y-1 text-sm">
        <div>✅ User Authenticated: {isAuthenticated ? "Yes" : "❌ No"}</div>
        <div>✅ Access Token: {accessToken ? "Present" : "❌ Missing"}</div>
        <div>✅ User Info: {user?.email || "❌ No user data"}</div>
        <div>
          ✅ PayPal Client ID:{" "}
          {import.meta.env.VITE_PAYPAL_CLIENT_ID ? "Set" : "❌ Missing"}
        </div>
        <div>
          ✅ Backend URL: {import.meta.env.VITE_BASE_URL || "❌ Missing"}
        </div>
      </div>
      {!isAuthenticated && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
          ⚠️ User must be logged in to make payments
        </div>
      )}
    </div>
  );
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  // State for managing payment method and Stripe client secret
  const [paymentMethod, setPaymentMethod] = useState("paypal"); // 'paypal' or 'stripe'
  const [clientSecret, setClientSecret] = useState("");
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
  const [createStripePaymentIntent, { isLoading: isCreatingStripeIntent }] =
    useCreateStripePaymentIntentMutation();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/courses");
      toast.error("Cart is empty. Please add courses to checkout.");
    }
  }, [cartItems, navigate]);

  // Create PaymentIntent for Stripe when the user selects the card option
  useEffect(() => {
    if (paymentMethod === "stripe" && cartTotal > 0) {
      createStripePaymentIntent({
        amount: Math.round(cartTotal * 100), // Convert to cents/pence
        currency: "gbp",
      })
        .unwrap()
        .then((data) => {
          setClientSecret(data.clientSecret);
        })
        .catch((error) => {
          console.error("Stripe Payment Intent creation error:", error);
          toast.error("Could not initialize Stripe payment. Please try again.");
        });
    }
  }, [paymentMethod, cartTotal, createStripePaymentIntent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
    // If cart becomes empty, navigate away
    if (cartItems.length === 1) {
      navigate("/courses");
    }
  };

  // Stripe appearance and options
  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#0570de",
        colorBackground: "#ffffff",
        colorText: "#30313d",
        colorDanger: "#df1b41",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "6px",
      },
    },
  };

  const isFormValid = () => {
    return (
      billingInfo.firstName.trim() &&
      billingInfo.lastName.trim() &&
      billingInfo.email.trim() &&
      billingInfo.email.includes("@")
    );
  };

  return (
    <CheckoutProtection>
      <PaymentDiagnostic />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Billing Information and Order Summary */}
          <div className="lg:col-span-2">
            {/* Billing Information */}
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
                    First Name *
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
                    Last Name *
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
                    Email *
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
                  />
                </div>
                <div className="md:col-span-2">
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
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Order Summary */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center border-b pb-4 last:border-b-0"
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
                            {item.level && `Level: ${item.level}`}
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
                  <div className="flex justify-between items-center pt-4 border-t font-semibold text-lg">
                    <span>Total:</span>
                    <span>£{cartTotal}</span>
                  </div>
                </div>
              ) : (
                <p>Your cart is empty.</p>
              )}
            </Card>
          </div>

          {/* Right Column - Payment Section */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>

              {/* Total Display */}
              <div className="flex justify-between items-center text-lg font-semibold border-b pb-4 mb-6">
                <span>Total:</span>
                <span>£{cartTotal}</span>
              </div>

              {/* Payment Method Selector */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <Button
                  variant={paymentMethod === "paypal" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("paypal")}
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a.628.628 0 0 0-.663-.734h-3.021c-.524 0-.968.382-1.05.9L15.24 14.5c-.082.518.285.934.809.934h2.705c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287-.17-.194-.36-.362-.57-.496z"
                    />
                  </svg>
                  PayPal
                </Button>
                <Button
                  variant={paymentMethod === "stripe" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("stripe")}
                  className="w-full"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Card
                </Button>
              </div>

              {/* Payment Form Section */}
              {!isFormValid() && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Please fill in required billing information before
                    proceeding with payment.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {/* PayPal Button Section */}
                {paymentMethod === "paypal" && isFormValid() && (
                  <PayPalCheckoutForm
                    cartTotal={cartTotal}
                    cartItems={cartItems}
                    billingInfo={billingInfo}
                  />
                )}

                {/* Stripe Elements Section */}
                {paymentMethod === "stripe" &&
                  isFormValid() &&
                  clientSecret && (
                    <Elements options={stripeOptions} stripe={stripePromise}>
                      <StripeCheckoutForm
                        clientSecret={clientSecret}
                        cartTotal={cartTotal}
                        cartItems={cartItems}
                        billingInfo={billingInfo}
                      />
                    </Elements>
                  )}

                {/* Loading States */}
                {paymentMethod === "stripe" &&
                  isFormValid() &&
                  (isCreatingStripeIntent || !clientSecret) && (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        Initializing secure payment...
                      </p>
                    </div>
                  )}
              </div>
            </Card>

            {/* Security Features */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Secure Checkout</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm">SSL encrypted payment</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-sm">Instant course access</span>
                </div>
                {/* <div className="flex items-center">
                  <Clock className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-sm">Lifetime access</span>
                </div> */}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </CheckoutProtection>
  );
};

export default CheckoutPage;
