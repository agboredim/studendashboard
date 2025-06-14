import { toast } from "react-toastify";
import { store } from "../store"; // Import the Redux store
import { api } from "../services/api"; // Import the RTK Query API
import { logout } from "../slices/authSlice"; // Import the logout action

const baseUrl = import.meta.env.VITE_BASE_URL;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

class GoogleAuthService {
  constructor() {
    this.scriptLoaded = false;
    this.scriptLoading = false;
    this.onScriptLoadCallbacks = [];
  }

  /**
   * Load the Google Identity Services script
   */
  loadScript() {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded) {
        resolve();
        return;
      }

      if (this.scriptLoading) {
        this.onScriptLoadCallbacks.push(resolve);
        return;
      }

      this.scriptLoading = true;

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.scriptLoaded = true;
        this.scriptLoading = false;
        this.onScriptLoadCallbacks.forEach((callback) => callback());
        this.onScriptLoadCallbacks = [];
        resolve();
      };
      script.onerror = (error) => {
        this.scriptLoading = false;
        console.error("Error loading Google Identity Services script:", error);
        reject(error);
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Initialize Google Sign-In
   * @param {string} buttonId - DOM ID of the button container
   * @param {Function} onSuccess - Callback for successful authentication
   */
  async initializeButton(buttonId, onSuccess) {
    try {
      await this.loadScript();

      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: this.handleCredentialResponse.bind(this, onSuccess),
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the button
      window.google.accounts.id.renderButton(
        document.getElementById(buttonId),
        {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 280,
        }
      );
    } catch (error) {
      console.error("Failed to initialize Google Sign-In:", error);
      toast.error("Failed to load Google Sign-In. Please try again later.");
    }
  }

  /**
   * Handle the credential response from Google
   * @param {Function} onSuccess - Callback for successful authentication
   * @param {Object} response - Google credential response
   */
  async handleCredentialResponse(onSuccess, response) {
    try {
      // Send the ID token to your backend via RTK Query mutation
      const result = await store
        .dispatch(
          api.endpoints.googleAuth.initiate({ token: response.credential })
        )
        .unwrap(); // Use unwrap to handle success/error directly

      if (result) {
        // The RTK Query mutation will automatically update the Redux state via authSlice extraReducers
        // with the new JWT tokens (access, refresh, user_info)
        onSuccess(result);
        toast.success("Successfully logged in with Google!");
      }
    } catch (error) {
      console.error("Google authentication error:", error);
      // RTK Query's transformErrorResponse will format the error, so we can access it directly
      const errorMessage =
        error.data?.message || "Authentication failed. Please try again.";
      toast.error(errorMessage);
    }
  }

  /**
   * Sign out the user from Google and clear local storage/Redux state
   */
  signOut() {
    try {
      if (this.scriptLoaded && window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }

      // Clear the NEW JWT tokens from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      // Also clear old token format for backwards compatibility
      localStorage.removeItem("token");

      // Dispatch the logout action to clear Redux state
      store.dispatch(logout());

      // Trigger the server-side logout mutation
      store.dispatch(api.endpoints.logout.initiate());

      toast.success("Successfully logged out!");
    } catch (error) {
      console.error("Error during logout:", error);
      // Still clear localStorage even if logout API fails
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      store.dispatch(logout());
    }
  }

  /**
   * Send the Google token to the backend for verification
   * @param {string} token - Google ID token
   * @returns {Promise<Object>} - Backend response
   * @deprecated - No longer needed as handleCredentialResponse now uses RTK Query directly.
   */
  async verifyGoogleToken(token) {
    console.warn(
      "verifyGoogleToken is deprecated. Use RTK Query googleAuth mutation instead."
    );
    // This method is now deprecated as handleCredentialResponse directly uses RTK Query.
    // It's kept for reference but its functionality is superseded.
    try {
      const response = await fetch(`${baseUrl}/customuser/api/google-login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Authentication failed",
        };
      }

      // NOTE: This is deprecated - new tokens should be handled by authSlice
      localStorage.setItem("token", data.token);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Error verifying Google token:", error);
      return {
        success: false,
        message: "Failed to verify authentication. Please try again.",
      };
    }
  }
}

export default new GoogleAuthService();
