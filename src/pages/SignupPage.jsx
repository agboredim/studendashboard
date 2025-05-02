import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signupSchema } from "../schemas/authSchemas";
import { useRegisterMutation } from "../services/api";
import Spinner from "../components/Spinner";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  // Use the register mutation hook
  const [register, { isLoading, isError, error, isSuccess }] =
    useRegisterMutation();

  const {
    register: registerField, // Renamed to avoid conflict with the mutation name
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  // Effect to handle registration state changes (success/error)
  useEffect(() => {
    // Handle registration errors
    if (isError && error) {
      // Prioritize specific error messages from the API if available
      const errorMessage =
        error.data?.error?.username?.[0] || // Check for username error message
        error.data?.error?.email?.[0] || // Check for email error message
        error.data?.error?.phone_number?.[0] || // Check for phone error message
        error.data?.message || // Check for general message
        error.error || // Check for generic error string
        "Registration failed. Please try again.";

      toast.error(errorMessage);
    }

    // Redirect when registered successfully
    if (isSuccess) {
      toast.success("Registration successful!");
      navigate("/portal", { replace: true });
    }
    // Added 'error' to dependencies to re-run effect on new errors
  }, [isError, isSuccess, error, navigate]); // Added 'error' to dependency array

  const onSubmit = async (data) => {
    const { username, email, phone_number, password } = data;

    const userData = {
      username,
      email,
      phone_number,
      password,
    };

    try {
      const response = await register(userData).unwrap();
      console.log("Registration response:", response); // Log the response here
      // Success is handled in the useEffect
    } catch (err) {
      console.error("Registration submission error:", err);
      // The error handling in useEffect will catch this based on isError state
      // Avoid duplicate toast calls here
    }
  };

  return (
    // Keeping a light neutral background for the page
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Spinner overlay - Styling adjusted for true overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}

      {/* Signup form */}
      {/* Card background white, shadow remains */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          {/* Heading using primary color */}
          <h2 className="mt-6 text-3xl font-bold text-primary">
            Create your account
          </h2>
          {/* Paragraph using foreground color with opacity */}
          <p className="mt-2 text-sm text-foreground/80">
            Join us and start your journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Username field */}
            <div className="relative">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              {/* Icon using foreground color with opacity */}
              <User className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <input
                id="username"
                type="text"
                {...registerField("username")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  // Error border remains red
                  errors.username ? "border-red-500" : "border-foreground/20" // Default border using foreground/20
                } placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Username"
              />
              {errors.username && (
                // Error text remains red
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email field */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              {/* Icon using foreground color with opacity */}
              <Mail className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <input
                id="email"
                type="email"
                {...registerField("email")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  // Error border remains red
                  errors.email ? "border-red-500" : "border-foreground/20" // Default border using foreground/20
                } placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && (
                // Error text remains red
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number field */}
            <div className="relative">
              <label htmlFor="phone_number" className="sr-only">
                Phone Number
              </label>
              {/* Icon using foreground color with opacity */}
              <Phone className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <input
                id="phone_number"
                type="tel"
                {...registerField("phone_number")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  // Error border remains red
                  errors.phone_number
                    ? "border-red-500"
                    : "border-foreground/20" // Default border using foreground/20
                } placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Phone number"
              />
              {errors.phone_number && (
                // Error text remains red
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              {/* Icon using foreground color with opacity */}
              <Lock className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...registerField("password")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  // Error border remains red
                  errors.password ? "border-red-500" : "border-foreground/20" // Default border using foreground/20
                } placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                // Icon button using foreground color with opacity
                className="absolute right-3 top-6 -translate-y-1/2 text-foreground/70"
              >
                {showPassword ? (
                  // Icons inherit text color
                  <EyeOff className="h-5 w-5" />
                ) : (
                  // Icons inherit text color
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                // Error text remains red
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              {/* Icon using foreground color with opacity */}
              <Lock className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...registerField("confirmPassword")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  // Error border remains red
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-foreground/20" // Default border using foreground/20
                } placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                // Icon button using foreground color with opacity
                className="absolute right-3 top-6 -translate-y-1/2 text-foreground/70"
              >
                {showConfirmPassword ? (
                  // Icons inherit text color
                  <EyeOff className="h-5 w-5" />
                ) : (
                  // Icons inherit text color
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {errors.confirmPassword && (
                // Error text remains red
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agreeToTerms" // Added name attribute for clarity
              type="checkbox"
              {...registerField("agreeToTerms")}
              // Checkbox using primary color for accent and ring
              className="h-4 w-4 text-primary focus:ring-primary border-foreground/20 rounded" // Border using foreground/20
            />
            <label
              htmlFor="agree-terms"
              // Text using foreground color
              className="ml-2 block text-sm text-foreground"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                // Link using primary color, hover using primary/80
                className="font-medium text-primary hover:text-primary/80"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                // Link using primary color, hover using primary/80
                className="font-medium text-primary hover:text-primary/80"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            // Error text remains red
            <p className="mt-1 text-sm text-red-600">
              {errors.agreeToTerms.message}
            </p>
          )}

          <div>
            <button
              type="submit"
              // Button using primary color, hover using primary/90, focus ring using primary
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          {/* Text using foreground color with opacity */}
          <p className="text-sm text-foreground/80">
            Already have an account?{" "}
            <Link
              to="/login"
              // Link using primary color, hover using primary/80
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              {/* Horizontal rule using foreground color with opacity */}
              <div className="w-full border-t border-foreground/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              {/* Text using foreground color with opacity, background white */}
              <span className="px-2 bg-white text-foreground/70">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              // Button using foreground color for text, border with opacity, light hover background
              className="inline-flex items-center justify-center py-2 px-6 border border-foreground/20 rounded-md shadow-sm bg-white text-foreground hover:bg-gray-50"
            >
              {/* Google icon - colors remain for branding */}
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
