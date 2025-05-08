import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { signupSchema } from "../schemas/authSchemas";
import { useRegisterMutation } from "../services/api";
import Spinner from "../components/Spinner";
import GoogleAuthButton from "../components/GoogleAuthButton";

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
    // Handle registration errors
    if (isError && error) {
      const errorMessage =
        error.data?.error?.username?.[0] ||
        error.data?.error?.email?.[0] ||
        error.data?.error?.phone_number?.[0] ||
        error.data?.message ||
        error.error ||
        "Registration failed. Please try again.";

      toast.error(errorMessage);
    }

    // Redirect when registered successfully
    if (isSuccess) {
      toast.success("Registration successful!");
      navigate("/portal", { replace: true });
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
      const response = await register(userData).unwrap();
      console.log("Registration response:", response);
    } catch (err) {
      console.error("Registration submission error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-primary">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-foreground/80">
            Join us and start your journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Form fields remain the same */}
          {/* ... */}

          <div className="rounded-md shadow-sm space-y-4">
            {/* Username field */}
            <div className="relative">
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <input
                id="username"
                type="text"
                {...registerField("username")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  errors.username ? "border-red-500" : "border-foreground/20"
                } placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
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
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <input
                id="email"
                type="email"
                {...registerField("email")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  errors.email ? "border-red-500" : "border-foreground/20"
                } placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
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
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <input
                id="phone_number"
                type="tel"
                {...registerField("phone_number")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  errors.phone_number
                    ? "border-red-500"
                    : "border-foreground/20"
                } placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
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
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...registerField("password")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  errors.password ? "border-red-500" : "border-foreground/20"
                } placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70"
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
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/60" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...registerField("confirmPassword")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-foreground/20"
                } placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70"
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
              name="agreeToTerms"
              type="checkbox"
              {...registerField("agreeToTerms")}
              className="h-4 w-4 text-primary focus:ring-primary border-foreground/20 rounded"
            />
            <label
              htmlFor="agree-terms"
              className="ml-2 block text-sm text-foreground"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="font-medium text-primary hover:text-primary/80"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="font-medium text-primary hover:text-primary/80"
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
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-foreground/80">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-foreground/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-foreground/70">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleAuthButton
              text="Sign up with Google"
              redirectPath="/portal"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
