import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CheckCircle } from "lucide-react";

// Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Redux
import { selectOrderId, selectPaymentStatus } from "@/store/slices/cartSlice";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const paymentStatus = useSelector(selectPaymentStatus);
  const storeOrderId = useSelector(selectOrderId);

  // Use either the URL param or the stored order ID
  const displayOrderId = orderId || storeOrderId;

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <div className="flex flex-col items-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500" />

          <h1 className="text-3xl font-bold">Order Confirmed!</h1>

          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been successfully
            processed.
          </p>

          {displayOrderId && (
            <div className="bg-gray-100 p-4 rounded-md w-full">
              <p className="text-sm text-gray-500">Order Reference</p>
              <p className="font-mono font-medium">{displayOrderId}</p>
            </div>
          )}

          <p className="text-gray-600">
            You will receive an email confirmation shortly with details about
            your purchase.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button asChild className="flex-1">
              <Link to="/portal/my-courses">Go to My Courses</Link>
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link to="/courses">Browse More Courses</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;
