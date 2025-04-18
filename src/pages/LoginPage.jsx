import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginSchema } from "../schemas/authSchemas";
import { useLoginMutation } from "../services/api";
import Spinner from "../components/Spinner";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/portal";

  // Use the login mutation hook
  const [login, { isLoading, isError, error, isSuccess, data }] =
    useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    // if (isError) {
    //   toast.error(data.error || "Login failed. Please try again.");
    // }

    // Redirect when logged in
    if (isSuccess) {
      navigate(from, { replace: true });
      toast.success("Login successful!");
    }
  }, [isError, isSuccess, data, navigate, from]);

  const onSubmit = async (formData) => {
    try {
      const response = await login(formData).unwrap();
      console.log("Login response:", response);
    } catch (err) {
      toast.error(err.error);
      toast.error(err.data.error);
      // Error is handled in the useEffect above
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Spinner overlay */}
      {isLoading && (
        <div className="">
          <Spinner />
        </div>
      )}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-blue-950">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Email field */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>

              <Mail className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                id="email"
                type="email"
                {...register("email")}
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

            {/* Password field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Lock className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-6 -translate-y-1/2 text-gray-500"
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                {...register("rememberMe")}
                className="h-4 w-4 text-blue-950 focus:ring-blue-950 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-950 hover:text-blue-800"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-950 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-950"
            >
              Sign in
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-950 hover:text-blue-800"
            >
              Sign up
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
                Or continue with
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
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
