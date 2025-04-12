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
    register: registerField,
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

  useEffect(() => {
    if (isError) {
      toast.error(
        error?.data?.message || "Registration failed. Please try again."
      );
    }

    // Redirect when registered
    if (isSuccess) {
      navigate("/student-portal", { replace: true });
      toast.success("Registration successful!");
    }
  }, [isError, isSuccess, error, navigate]);

  const onSubmit = async (data) => {
    const { username, email, phone_number, password } = data;

    const userData = {
      username,
      email,
      phone_number,
      password,
    };

    try {
      await register(userData).unwrap();
    } catch (err) {
      console.log(err);
      // Error is handled in the useEffect above
    }
  };

  // if (isLoading) {
  //   return <Spinner />;
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-blue-950">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
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
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="username"
                type="text"
                {...registerField("username")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 focus:z-10 sm:text-sm`}
                placeholder="Username"
              />
              {errors.username && (
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
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                {...registerField("email")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && (
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
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="phone_number"
                type="tel"
                {...registerField("phone_number")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  errors.phone_number ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 focus:z-10 sm:text-sm`}
                placeholder="Phone number"
              />
              {errors.phone_number && (
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
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...registerField("password")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
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
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...registerField("confirmPassword")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="agree-terms"
              type="checkbox"
              {...registerField("agreeToTerms")}
              className="h-4 w-4 text-blue-950 focus:ring-blue-950 border-gray-300 rounded"
            />
            <label
              htmlFor="agree-terms"
              className="ml-2 block text-sm text-gray-900"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="font-medium text-blue-950 hover:text-blue-800"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="font-medium text-blue-950 hover:text-blue-800"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600">
              {errors.agreeToTerms.message}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-950"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-950 hover:text-blue-800"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className="inline-flex items-center justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
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
