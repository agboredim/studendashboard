import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { loginSchema } from "../schemas/authSchemas"
import { useLoginMutation } from "../services/api"
import Spinner from "../components/Spinner"
import GoogleAuthButton from "../components/GoogleAuthButton"

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch() // useDispatch is imported but not used in this component's logic

  // Get redirect path from location state or default to portal
  const from = location.state?.from?.pathname || "/portal"

  // Use the login mutation hook
  const [login, { isLoading, isError, error, isSuccess, data }] = useLoginMutation()

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
  })

  // Effect to handle login state changes (success/error)
  useEffect(() => {
    // Handle login errors
    if (isError && error) {
      // Prioritize the error message from the response data if available, otherwise use a generic message
      const errorMessage = error.data?.error || error.error || "Login failed. Please try again."
      toast.error(errorMessage)
    }

    // Redirect when logged in successfully
    if (isSuccess) {
      // toast.success("Login successful!"); // Uncomment if you want a success toast
      navigate(from, { replace: true })
    }
    // Added 'error' to dependencies to re-run effect on new errors
  }, [isError, isSuccess, error, navigate, from]) // Added 'error' to dependency array

  const onSubmit = async (formData) => {
    // Error handling is now primarily in the useEffect
    try {
      const response = await login(formData).unwrap()
      console.log("Login response:", response)
      // Success is handled in the useEffect
    } catch (err) {
      console.error("Login submission error:", err)
      // The error handling in useEffect will catch this
      // Avoid multiple toast.error calls here, let useEffect handle it based on isError state
    }
  }

  return (
    // Keeping a light neutral background for the page
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Spinner overlay - Styling might need adjustment for true overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <Spinner />
        </div>
      )}
      {/* Card background white, shadow remains */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          {/* Heading using primary color */}
          <h2 className="mt-6 text-3xl font-bold text-primary">Welcome back</h2>
          {/* Paragraph using foreground color with opacity */}
          <p className="mt-2 text-sm text-foreground/80">Please sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* Email field */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>

              {/* Icon using foreground color with opacity */}
              <Mail className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-foreground/60 pointer-events-none" />
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`appearance-none relative block w-full px-10 py-3 border ${
                  // Error border remains red
                  errors.email ? "border-red-500" : "border-foreground/20" // Default border using foreground/20
                } placeholder-foreground/60 text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />

              {errors.email && (
                // Error text remains red
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              {/* Icon using foreground color with opacity */}
              <Lock className="absolute left-3 top-6 -translate-y-1/2 h-5 w-5 text-foreground/60 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
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
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="rememberMe" // Added name attribute for clarity
                type="checkbox"
                {...register("rememberMe")}
                // Checkbox using primary color for accent and ring
                className="h-4 w-4 text-primary focus:ring-primary border-foreground/20 rounded" // Border using foreground/20
              />
              <label
                htmlFor="remember-me"
                // Text using foreground color
                className="ml-2 block text-sm text-foreground"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                // Link using primary color, hover using primary/80
                className="font-medium text-primary hover:text-primary/80"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              // Button using primary color, hover using primary/90, focus ring using primary
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Sign in
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          {/* Text using foreground color with opacity */}
          <p className="text-sm text-foreground/80">
            Don't have an account?{" "}
            <Link
              to="/signup"
              // Link using primary color, hover using primary/80
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign up
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
              <span className="px-2 bg-white text-foreground/70">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleAuthButton redirectPath={from} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
