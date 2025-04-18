import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import { WhatsAppButton } from "./components/WhatsAppButton";
import LoginPage from "./pages/LoginPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import AboutPage from "./pages/AboutPage";
import { Provider } from "react-redux";
import store from "./store";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentPortalPage from "./pages/StudentPortalPage";
import { ToastContainer } from "react-toastify";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="courses/:courseId" element={<CourseDetailPage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogPostPage />} />

              {/* Protected Routes */}
              <Route
                path="/portal"
                element={
                  <ProtectedRoute>
                    <StudentPortalPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
          <WhatsAppButton />
        </Router>
        <ToastContainer position="top-right" autoClose={5000} />
      </Provider>
    </>
  );
}

export default App;
