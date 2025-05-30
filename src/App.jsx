import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "@/components/ui/sonner";

import store from "./store";

import Layout from "./components/Layout";

// Components
import { WhatsAppButton } from "./components/WhatsAppButton";
import ProtectedRoute from "./components/ProtectedRoute";
import { WorkshopEvents } from "./pages/WorkshopEvents";

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
import Library from "./components/portal/Library";
import CourseLibrary from "./pages/EnrollCoursesPage";
import CourseDetail from "./pages/CourseDetailsScreen";
import MyCourses from "./pages/MyCourses";
import CourseLearning from "./pages/CourseLearning";
import ProgressAnalytics from "./pages/ProgressAnalytics";
import AssignmentSubmission from "./pages/AssignmentSubmission";
import Assignments from "./pages/Assignments";
import StudentProfile from "./pages/StudentProfile";
import CourseLibraryDetail from "./pages/CourseLibaryDetails";
import { ContactPage } from "./pages/ContactPage";
import { OurStoryPage } from "./pages/OurStoryPage";
import { PartnerWithUs } from "./pages/PartnerWithUs";
import { ServicesPage } from "./pages/ServicesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { RefundPolicy } from "./pages/RefundPolicy";
import TeamsChat from "./pages/TeamsChat";

function App() {
  // Get Google Client ID from environment variables using Vite's import.meta.env
  // const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    ? import.meta.env.VITE_GOOGLE_CLIENT_ID
    : "your-google-client-id"; // Replace with your actual client ID

  console.log("Using Google Client ID:", googleClientId);

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <Router>
          <Routes>
            {/* Authentication Pages (outside main layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Main Layout Routes */}
            <Route path="/" element={<Layout />}>
              {/* Public Routes */}
              <Route index element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/story" element={<OurStoryPage />} />
              <Route path="/partner" element={<PartnerWithUs />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:courseId" element={<CourseDetailPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogPostPage />} />
              <Route path="events" element={<WorkshopEvents />} />

              {/* Checkout Routes (require authentication AND non-empty cart) */}
              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
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
            <Route
              path="/portal/enroll-courses"
              element={
                <ProtectedRoute>
                  <CourseLibrary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/enroll-courses/:courseId"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/courses"
              element={
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/learn/:id"
              element={
                <ProtectedRoute>
                  <CourseLearning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/progress"
              element={
                <ProtectedRoute>
                  <ProgressAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/library"
              element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/library/:id"
              element={
                <ProtectedRoute>
                  <CourseLibraryDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/assignments"
              element={
                <ProtectedRoute>
                  <Assignments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/assignments/:id/submit"
              element={
                <ProtectedRoute>
                  <AssignmentSubmission />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/chat"
              element={
                <ProtectedRoute>
                  <TeamsChat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/profile"
              element={
                <ProtectedRoute>
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route for undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Global Components */}
          <WhatsAppButton />
          <ToastContainer position="top-right" autoClose={5000} />
          <Toaster />
        </Router>
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
