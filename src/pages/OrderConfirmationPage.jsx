import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearCart } from "../store/slices/cartSlice";

function OrderConfirmationPage() {
  const dispatch = useDispatch();

  // Clear the cart when the order is confirmed
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>

      <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p className="text-lg mb-8">
        Your order has been received and is now being processed. You will
        receive an email confirmation shortly.
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="flex justify-between mb-2">
          <span>Order Number:</span>
          <span className="font-medium">
            #ORD-{Math.floor(100000 + Math.random() * 900000)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Date:</span>
          <span className="font-medium">{new Date().toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Payment Method:</span>
          <span className="font-medium">Credit Card</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="bg-blue-950 hover:bg-blue-900">
          <Link to="/courses">Browse More Courses</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/student-portal">Go to Student Portal</Link>
        </Button>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
