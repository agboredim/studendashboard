import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../store/slices/authSlice";
import { useGoogleAuthMutation } from "../services/api";

const GoogleAuthButton = ({ redirectPath = "/portal", className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [googleAuth, { isLoading }] = useGoogleAuthMutation();

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("Google response:", credentialResponse);

      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      // Send the credential token to your backend
      const response = await googleAuth({
        token: credentialResponse.credential,
      }).unwrap();

      console.log("Backend response:", response);

      if (!response.user) {
        throw new Error("No user data received from backend");
      }

      // Handle successful authentication
      dispatch(
        login({
          user: response.user,
          isAuthenticated: true,
        })
      );

      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate(redirectPath);
      }, 100);

      toast.success("Successfully signed in with Google!");
    } catch (error) {
      console.error("Google authentication error:", error);
      toast.error(
        error.data?.message || "Authentication failed. Please try again."
      );
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={(error) => {
          console.error("Google Login Error:", error);
          toast.error("Google sign-in failed. Please try again.");
        }}
        useOneTap={false}
        text="continue_with"
        shape="rectangular"
        width="100%"
        locale="en"
      />
      {isLoading && (
        <div className="mt-2 flex items-center justify-center">
          <div className="w-5 h-5 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
          <span className="ml-2">Signing in...</span>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;
