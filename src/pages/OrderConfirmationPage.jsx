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
        {/* Success icon color remains green */}
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>

      {/* Heading using foreground color */}
      <h1 className="text-3xl font-bold mb-4 text-foreground">
        Thank You for Your Order!
      </h1>
      {/* Paragraph using foreground color */}
      <p className="text-lg mb-8 text-foreground">
        Your order has been received and is now being processed. You will
        receive an email confirmation shortly.
      </p>

      {/* Order details background gray-50 remains */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        {/* Heading using primary color */}
        <h2 className="text-xl font-bold mb-4 text-primary">Order Details</h2>
        {/* Text using foreground color */}
        <div className="flex justify-between mb-2 text-foreground">
          <span>Order Number:</span>
          <span className="font-medium">
            #ORD-{Math.floor(100000 + Math.random() * 900000)}
          </span>
        </div>
        {/* Text using foreground color */}
        <div className="flex justify-between mb-2 text-foreground">
          <span>Date:</span>
          <span className="font-medium">{new Date().toLocaleDateString()}</span>
        </div>
        {/* Text using foreground color */}
        <div className="flex justify-between mb-2 text-foreground">
          <span>Payment Method:</span>
          <span className="font-medium">Credit Card</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* Button background primary, hover primary/90 */}
        <Button asChild className="bg-primary hover:bg-primary/90">
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
