import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Spinner from "../components/Spinner";

// Validation schema for the checkout form
const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  country: yup.string().required("Country is required"),
  streetAddress: yup.string().required("Street address is required"),
  city: yup.string().required("City is required"),
  postcode: yup.string().required("Postcode/ZIP is required"),
  phone: yup.string().required("Phone number is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  paymentMethod: yup.string().required("Please select a payment method"),
});

function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const navigate = useNavigate();

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Mock cart data - in a real app, this would come from your cart state
  const cartItem = {
    name: "UK Compliance 17",
    price: 500,
    quantity: 1,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      country: "United Kingdom (UK)",
      paymentMethod: "card",
    },
  });

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user) {
      setValue("firstName", user.firstName || "");
      setValue("lastName", user.lastName || "");
      setValue("email", user.email || "");
      // Set other fields if available in user object
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Here you would process the order with your payment processor
      console.log("Order data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to success page
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 uppercase">Checkout</h1>

      <div className="border-t border-b border-gray-200 py-4 mb-6">
        <div className="flex items-start gap-2">
          <Check className="h-5 w-5 text-blue-950 mt-0.5" />
          <p>"{cartItem.name}" has been added to your cart</p>
        </div>
      </div>

      {/* Login option for returning customers */}
      <div className="border-b border-gray-200 py-4 mb-6">
        <button
          className="flex items-center gap-2 text-blue-950 hover:text-blue-800"
          onClick={() => setShowLogin(!showLogin)}
        >
          <span className="inline-block w-5">
            {showLogin ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5 transform -rotate-90" />
            )}
          </span>
          Returning customer? Click here to Login
        </button>

        {showLogin && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="mb-4">
              If you have shopped with us before, please enter your details
              below.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <Button className="bg-blue-950 hover:bg-blue-900">Login</Button>
            </div>
          </div>
        )}
      </div>

      {/* Coupon code option */}
      <div className="border-b border-gray-200 py-4 mb-6">
        <button
          className="flex items-center gap-2 text-blue-950 hover:text-blue-800"
          onClick={() => setShowCoupon(!showCoupon)}
        >
          <span className="inline-block w-5">
            {showCoupon ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5 transform -rotate-90" />
            )}
          </span>
          Have a Coupon? Click here to enter your code
        </button>

        {showCoupon && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Coupon code"
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <Button className="bg-blue-950 hover:bg-blue-900">
                Apply Coupon
              </Button>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing details */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Billing details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block mb-1">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register("firstName")}
                  className={`w-full p-3 border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } rounded-md bg-gray-50`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block mb-1">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register("lastName")}
                  className={`w-full p-3 border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } rounded-md bg-gray-50`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="country" className="block mb-1">
                Country / Region
              </label>
              <div className="relative">
                <select
                  id="country"
                  {...register("country")}
                  className={`w-full p-3 border ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  } rounded-md bg-gray-50 appearance-none`}
                >
                  <option value="United Kingdom (UK)">
                    United Kingdom (UK)
                  </option>
                  <option value="United States (US)">United States (US)</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  {/* Add more countries as needed */}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="streetAddress" className="block mb-1">
                Street address
              </label>
              <input
                id="streetAddress"
                type="text"
                placeholder="House number and street name"
                {...register("streetAddress")}
                className={`w-full p-3 border ${
                  errors.streetAddress ? "border-red-500" : "border-gray-300"
                } rounded-md bg-gray-50`}
              />
              {errors.streetAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.streetAddress.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="city" className="block mb-1">
                Town / city
              </label>
              <input
                id="city"
                type="text"
                {...register("city")}
                className={`w-full p-3 border ${
                  errors.city ? "border-red-500" : "border-gray-300"
                } rounded-md bg-gray-50`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="state" className="block mb-1">
                State / Country (optional)
              </label>
              <input
                id="state"
                type="text"
                {...register("state")}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="postcode" className="block mb-1">
                Postcode / ZIP
              </label>
              <input
                id="postcode"
                type="text"
                {...register("postcode")}
                className={`w-full p-3 border ${
                  errors.postcode ? "border-red-500" : "border-gray-300"
                } rounded-md bg-gray-50`}
              />
              {errors.postcode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.postcode.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                {...register("phone")}
                className={`w-full p-3 border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-md bg-gray-50`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`w-full p-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md bg-gray-50`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-md p-6">
              <h2 className="text-xl font-bold mb-4">Your order</h2>

              <div className="mb-4">
                <div className="font-medium mb-2">Product</div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span>
                    {cartItem.name} × {cartItem.quantity}
                  </span>
                  <span>${cartItem.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-200 mb-4">
                <span className="font-medium">Subtotal</span>
                <span>${cartItem.price.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-200 mb-6">
                <span className="font-medium">Total</span>
                <span className="font-bold">${cartItem.price.toFixed(2)}</span>
              </div>

              {/* Payment methods */}
              <div className="mb-6">
                <div className="mb-4">
                  <label className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      value="card"
                      checked={selectedPayment === "card"}
                      onChange={() => setSelectedPayment("card")}
                      {...register("paymentMethod")}
                      className="h-4 w-4 text-blue-950"
                    />
                    <span>Credit / Debit card</span>
                  </label>

                  {selectedPayment === "card" && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="mb-3">
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm mb-1"
                        >
                          Card number
                        </label>
                        <input
                          id="cardNumber"
                          type="text"
                          placeholder="1234 1234 1234 1234"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="expiryDate"
                            className="block text-sm mb-1"
                          >
                            Expiration date
                          </label>
                          <input
                            id="expiryDate"
                            type="text"
                            placeholder="MM / YY"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="securityCode"
                            className="block text-sm mb-1"
                          >
                            Security code
                          </label>
                          <input
                            id="securityCode"
                            type="text"
                            placeholder="CVC"
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    value="klarna"
                    checked={selectedPayment === "klarna"}
                    onChange={() => setSelectedPayment("klarna")}
                    {...register("paymentMethod")}
                    className="h-4 w-4 text-blue-950"
                  />
                  <span>Klarna</span>
                </label>

                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    value="clearpay"
                    checked={selectedPayment === "clearpay"}
                    onChange={() => setSelectedPayment("clearpay")}
                    {...register("paymentMethod")}
                    className="h-4 w-4 text-blue-950"
                  />
                  <span>Clearpay</span>
                </label>

                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    value="paypal"
                    checked={selectedPayment === "paypal"}
                    onChange={() => setSelectedPayment("paypal")}
                    {...register("paymentMethod")}
                    className="h-4 w-4 text-blue-950"
                  />
                  <span>PayPal</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="bnpl"
                    checked={selectedPayment === "bnpl"}
                    onChange={() => setSelectedPayment("bnpl")}
                    {...register("paymentMethod")}
                    className="h-4 w-4 text-blue-950"
                  />
                  <span>Buy Now Pay Later</span>
                </label>

                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Your personal data will be used to process your order, support
                your experience throughout this website and for other purposes
                described in our privacy policy.
              </p>

              <Button
                type="submit"
                className="w-full py-3 bg-blue-950 hover:bg-blue-900 text-white uppercase font-bold"
              >
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Trusted by section */}
      <div className="mt-16 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold text-blue-950 mb-4">
              Trusted by
              <br />
              industry leaders
            </h2>
            <p className="mb-6">
              Join the ranks of industry leaders who trust us to deliver
              excellence
            </p>
            <Button className="bg-blue-950 hover:bg-blue-900">
              Find out why
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Replace with actual client logos */}
            <div className="h-12 flex items-center justify-center">
              <span className="text-gray-500 font-medium">Deloitte</span>
            </div>
            <div className="h-12 flex items-center justify-center">
              <span className="text-gray-500 font-medium">Capitec</span>
            </div>
            <div className="h-12 flex items-center justify-center">
              <span className="text-gray-500 font-medium">Informa</span>
            </div>
            <div className="h-12 flex items-center justify-center">
              <span className="text-gray-500 font-medium">Cipla</span>
            </div>
            <div className="h-12 flex items-center justify-center">
              <span className="text-gray-500 font-medium">Mukuru</span>
            </div>
            <div className="h-12 flex items-center justify-center">
              <span className="text-gray-500 font-medium">Nedbank</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-950 text-white rounded-lg p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Ready to maximise performance, retention and revenue?
            </h2>
            <p className="mb-6">
              Let's explore how we can help you optimize training to reach
              business objectives
            </p>
            <Button className="bg-white text-blue-950 hover:bg-gray-100">
              Book a demo
            </Button>
          </div>

          <div className="flex justify-center">
            {/* Replace with actual image */}
            <div className="w-64 h-64 rounded-full bg-blue-800 flex items-center justify-center">
              <span className="text-white">Demo Image</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
