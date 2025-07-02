import { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CheckCircle,
  BookOpen,
  User,
  ArrowRight,
  Download,
} from "lucide-react";

// Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Redux
import { selectOrderId } from "@/store/slices/cartSlice";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const storeOrderId = useSelector(selectOrderId);
  const { user } = useSelector((state) => state.auth);

  // Get order details from navigation state or Redux
  const [orderDetails, setOrderDetails] = useState(null);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use either the URL param or the stored order ID
  const displayOrderId = orderId || storeOrderId || orderDetails?.order_id;

  useEffect(() => {
    console.log("🏁 OrderConfirmationPage mounted!");
    console.log("🔍 orderId from URL:", orderId);
    console.log("🔍 location.state:", location.state);
    console.log("🔍 storeOrderId:", storeOrderId);

    window.scrollTo(0, 0);

    // 1. Check for direct access with order ID
    if (orderId) {
      setIsLoading(false);
      return;
    }

    // 2. Check for navigation state (from PayPal/Stripe)
    if (location.state?.orderDetails) {
      setOrderDetails(location.state.orderDetails);
      setCourse(location.state.course);
      setIsLoading(false);
      return;
    }

    // 3. Check for Redux store data
    if (storeOrderId) {
      setIsLoading(false);
      return;
    }

    // 4. Only redirect if no data found
    const timer = setTimeout(() => {
      setIsLoading(false);
      navigate("/courses");
    }, 3000);

    return () => clearTimeout(timer);
  }, [orderId, location.state, storeOrderId, navigate]);

  if (isLoading) {
    return <div>Loading order confirmation...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-3xl mx-auto p-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you {user?.first_name && `, ${user.first_name}`}! Your course
            enrollment is confirmed.
          </p>
        </div>

        {/* Order Details */}
        {displayOrderId && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Order Reference
                </p>
                <p className="font-mono text-lg font-semibold">
                  {displayOrderId}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Payment Method
                </p>
                <p className="text-lg font-semibold">
                  {orderDetails?.payment_method || "PayPal"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Course Details */}
        {course && (
          <Card className="p-6 mb-8 border-l-4 border-l-green-500">
            <div className="flex items-start space-x-4">
              <img
                src={`${import.meta.env.VITE_BASE_URL}${course.image}`}
                alt={course.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
                <p className="text-gray-600 mb-2">
                  {course.description?.substring(0, 120)}...
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {course.level && <span>Level: {course.level}</span>}
                  {course.duration && <span>Duration: {course.duration}</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  £{course.price?.toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Next Steps */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Access Your Course</h3>
              <p className="text-sm text-gray-600">
                Start learning immediately in your student portal
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-600">
                Confirmation and access details sent to your inbox
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">
                Monitor your learning journey and earn certificates
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild size="lg" className="w-full">
            <Link to="/portal" className="flex items-center justify-center">
              <User className="w-5 h-5 mr-2" />
              Student Portal
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full">
            <Link
              to="/portal/courses"
              className="flex items-center justify-center"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              My Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          <Button asChild variant="secondary" size="lg" className="w-full">
            <Link to="/courses" className="flex items-center justify-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Browse More
            </Link>
          </Button>
        </div>

        {/* Support */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-gray-600 mb-4">
            Need help? Our support team is here for you.
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/community">Join Community</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;
