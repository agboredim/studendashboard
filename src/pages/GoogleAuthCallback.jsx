import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { handleGoogleAuthCallback } from "../utils/authUtils"
import { login } from "../store/slices/authSlice"
import Spinner from "../components/Spinner"

const GoogleAuthCallback = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    // Handle the callback
    handleGoogleAuthCallback(navigate, dispatch, login)
  }, [navigate, dispatch])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner />
      <p className="ml-2 text-gray-600">Processing your sign in...</p>
    </div>
  )
}

export default GoogleAuthCallback
