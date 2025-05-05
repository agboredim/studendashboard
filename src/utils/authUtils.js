import { toast } from "react-toastify"

// Function to handle Google auth callback
export const handleGoogleAuthCallback = (navigate, dispatch, loginAction) => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get("token")
  const error = urlParams.get("error")

  // Get the redirect path from localStorage or default to portal
  const redirectPath = localStorage.getItem("authRedirectPath") || "/portal"

  // Clear the redirect path from localStorage
  localStorage.removeItem("authRedirectPath")

  if (token) {
    // Store the token in localStorage
    localStorage.setItem("token", token)

    // Get user data from the token (assuming JWT)
    try {
      // This is a simplified example - in a real app, you'd decode the JWT
      // and extract the user data
      const userData = { token }

      // Dispatch login action to update Redux state
      if (dispatch && loginAction) {
        dispatch(loginAction(userData))
      }

      // Show success message
      toast.success("Successfully signed in with Google!")

      // Redirect to the intended destination
      navigate(redirectPath)
    } catch (err) {
      console.error("Error processing Google auth token:", err)
      toast.error("Error processing authentication. Please try again.")
    }
  } else if (error) {
    // Show error message
    toast.error(`Google authentication failed: ${error}`)
  }
}
