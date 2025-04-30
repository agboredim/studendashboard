import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Store
import store from "./store";

// Layout
import Layout from "./components/Layout";

// Components
import { WhatsAppButton } from "./components/WhatsAppButton";
import ProtectedRoute from "./components/ProtectedRoute";
import CheckoutProtection from "./components/CheckoutProtection";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import NotFound from "./pages/not-found";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Authentication Pages (outside main layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Main Layout Routes */}
          <Route path="/" element={<Layout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:courseId" element={<CourseDetailPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />

            {/* Checkout Routes (require authentication AND non-empty cart) */}
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <CheckoutProtection>
                    <CheckoutPage />
                  </CheckoutProtection>
                </ProtectedRoute>
              }
            />

            <Route
              path="order-confirmation"
              element={
                <ProtectedRoute>
                  <OrderConfirmationPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Protected Routes (require authentication) */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for undefined paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Global Components */}
        <WhatsAppButton />
        <ToastContainer position="top-right" autoClose={5000} />
      </Router>
    </Provider>
  );
}

export default App;
