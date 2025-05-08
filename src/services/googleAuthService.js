import { toast } from "react-toastify";

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
      // Send the ID token to your backend
      const result = await this.verifyGoogleToken(response.credential);

      if (result.success) {
        // Call the success callback with the user data and token
        onSuccess(result.data);
      } else {
        toast.error(
          result.message || "Authentication failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Google authentication error:", error);
      toast.error("Authentication failed. Please try again.");
    }
  }

  /**
   * Send the Google token to the backend for verification
   * @param {string} token - Google ID token
   * @returns {Promise<Object>} - Backend response
   */
  async verifyGoogleToken(token) {
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

      // Store the authentication token
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

  /**
   * Sign out the user from Google
   */
  signOut() {
    if (this.scriptLoaded && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }
}

export default new GoogleAuthService();
