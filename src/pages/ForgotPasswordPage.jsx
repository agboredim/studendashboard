import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Spinner from "../components/Spinner";
import { requestPasswordResetSchema } from "../schemas/passwordSchemas";
import { useRequestPasswordResetMutation } from "../services/api"; // Import the new mutation

function ForgotPasswordPage() {
  const [requestPasswordReset, { isLoading, isSuccess, isError, error, data }] =
    useRequestPasswordResetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Password reset email sent successfully!");
    }

    if (isError) {
      let errorMessage;
      if (error?.data?.email && Array.isArray(error.data.email)) {
        errorMessage = error.data.email.join(" ");
      } else if (error?.data?.email) {
        errorMessage = error.data.email;
      } else if (error?.data?.detail) {
        errorMessage = error.data.detail;
      } else {
        errorMessage = "Failed to send reset email. Please try again.";
      }
      toast.error(errorMessage);
    }
  }, [isSuccess, isError, error, data]);

  const onSubmit = (formData) => {
    console.log("Forgot password request body:", formData);
    requestPasswordReset(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/70">
            Enter your email to receive a password reset link.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Send Reset Email"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-foreground/80">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
