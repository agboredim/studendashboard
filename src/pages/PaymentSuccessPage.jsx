import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Clock, ArrowRight, Download, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Uncomment and replace with your actual hooks
// import { useConfirmEnrollmentMutation, usePaymentStatusQuery } from '@/services/api';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    paymentIntent,
    orderDetails,
    course,
    billingInfo,
    enrolled = false,
    enrollmentPending = false,
    paymentMethod = 'stripe',
  } = location.state || {};

  const [enrollmentStatus, setEnrollmentStatus] = useState(enrolled ? 'completed' : 'pending');

  // Redirect if critical data is missing
  useEffect(() => {
    if (!orderDetails || !course) {
      navigate('/courses');
    }
  }, [orderDetails, course, navigate]);

  // Uncomment this when ready
  // const { data: paymentStatus, refetch } = usePaymentStatusQuery(paymentIntent?.id || orderDetails?.id, {
  //   skip: !paymentIntent?.id && !orderDetails?.id,
  //   pollingInterval: enrollmentStatus === 'pending' ? 5000 : 0,
  // });

  // useEffect(() => {
  //   if (paymentStatus?.enrolled) {
  //     setEnrollmentStatus('completed');
  //   }
  // }, [paymentStatus]);

  const handleConfirmEnrollment = async () => {
    if (!paymentIntent?.id) return;
    try {
      // Replace with actual confirmation logic
      const result = { success: true, enrolled: true };

      if (result.success && result.enrolled) {
        setEnrollmentStatus('completed');
      }
    } catch (error) {
      console.error('Manual enrollment confirmation failed:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-GB', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };

  const formatAmount = (amount, currency = 'GBP') =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
    }).format(amount);

  if (!orderDetails || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment information not found</h1>
          <Link to="/courses" className="text-blue-600 hover:underline">
            Return to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        {enrollmentStatus === 'completed' ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Complete!</h1>
            <p className="text-lg text-gray-600">Welcome to your course. You can start learning now!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Clock className="h-16 w-16 text-yellow-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Received</h1>
            <p className="text-lg text-gray-600">
              We're processing your enrollment. This usually takes just a moment.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Course Details</h2>
            <div className="flex items-start space-x-4">
              <img
                src={
                  course.image?.startsWith('http')
                    ? course.image
                    : `${import.meta.env.VITE_BASE_URL}${course.image}`
                }
                alt={course.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration || 'Self-paced'}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <div className="space-y-4">
              {enrollmentStatus === 'completed' ? (
                <>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Course access activated</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Welcome email sent</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Course materials available</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-700">Processing enrollment...</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-500">Welcome email pending</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-500">Course materials pending</span>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Payment Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Course Price</span>
                <span className="font-medium">
                  {formatAmount(orderDetails.amount || course.price)}
                </span>
              </div>
              {orderDetails.discount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatAmount(orderDetails.discount)}</span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Paid</span>
                  <span>{formatAmount(orderDetails.total || orderDetails.amount)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="capitalize">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-xs">
                  {paymentIntent?.id || orderDetails?.transaction_id || orderDetails?.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span>{formatDate(orderDetails.created_at || new Date())}</span>
              </div>

              {billingInfo && (
                <div className="border-t pt-3 mt-3">
                  <p className="text-gray-600 mb-2">Billing Address</p>
                  <div className="text-sm text-gray-700">
                    <p>{billingInfo.name || `${billingInfo.firstName} ${billingInfo.lastName}`}</p>
                    <p>{billingInfo.address?.line1 || billingInfo.address}</p>
                    {billingInfo.address?.line2 && <p>{billingInfo.address.line2}</p>}
                    <p>{billingInfo.city}, {billingInfo.postalCode}</p>
                    <p>{billingInfo.country}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-3">
            {enrollmentStatus === 'completed' ? (
              <Button asChild className="w-full">
                <Link to={`/courses/${course.id}/learn`}>
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button onClick={handleConfirmEnrollment} className="w-full" disabled={!paymentIntent?.id}>
                Check Enrollment Status
              </Button>
            )}
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/courses">Browse More Courses</Link>
            </Button>
          </div>
        </div>
      </div>

      <Card className="mt-8 p-6 bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have questions about your purchase, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/help">View FAQ</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
