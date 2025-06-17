// Format the cart items for PayPal (single course only)
export const formatItemsForPayPal = (cartItems) => {
  // Since system only supports single course, get the first item
  const course = cartItems[0];

  if (!course) {
    throw new Error("No course in cart");
  }

  return [
    {
      name: course.name,
      description: course.description?.substring(0, 127) || "Course",
      sku: course.id.toString(),
      unit_amount: {
        currency_code: "GBP",
        value: course.price.toString(),
      },
      quantity: "1",
      category: "DIGITAL_GOODS",
    },
  ];
};

// Calculate order total (single course)
export const calculateOrderTotal = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return "0.00";
  }

  // Single course system - only first item
  const course = cartItems[0];
  return (course.price || 0).toFixed(2);
};

// DEPRECATED: Old format for backend processing (kept for compatibility)
// export const formatOrderForBackend = (
//   cartItems,
//   paypalOrderData,
//   paypalPaymentData
// ) => {
//   const course = cartItems[0]; // Single course only

//   return {
//     order_items: [
//       {
//         course_id: course.id,
//         price: course.price,
//       },
//     ],
//     payment_details: {
//       payment_method: "paypal",
//       payment_id: paypalPaymentData.id,
//       order_id: paypalOrderData.id,
//       status: paypalPaymentData.status,
//       amount: calculateOrderTotal(cartItems),
//       currency: "GBP",
//       payer_email: paypalPaymentData.payer?.email_address || "",
//       payer_id: paypalPaymentData.payer?.payer_id || "",
//     },
//   };
// };

// NEW: Secure format for backend verification and processing
export const formatSecurePaymentData = (
  cartItems,
  paypalOrderData,
  paypalPaymentData,
  billingInfo
) => {
  if (!cartItems || cartItems.length === 0) {
    throw new Error("No course in cart");
  }

  const course = cartItems[0]; // Single course only
  const amount = calculateOrderTotal(cartItems);

  return {
    payment_id: paypalPaymentData.id, // PayPal payment ID for verification
    order_id: paypalOrderData.id, // PayPal order ID
    expected_amount: amount, // Expected payment amount
    course_id: course.id, // Single course ID
    currency: "GBP", // Payment currency
    payer_email: paypalPaymentData.payer?.email_address || billingInfo?.email,
    billing_info: {
      first_name: billingInfo?.firstName || "",
      last_name: billingInfo?.lastName || "",
      email: billingInfo?.email || "",
      address: billingInfo?.address || "",
      city: billingInfo?.city || "",
      postal_code: billingInfo?.postalCode || "",
      country: billingInfo?.country || "United Kingdom",
    },
    // Additional PayPal verification data
    paypal_details: {
      payer_id: paypalPaymentData.payer?.payer_id || "",
      payment_status: paypalPaymentData.status,
      create_time: paypalPaymentData.create_time,
      update_time: paypalPaymentData.update_time,
    },
  };
};

// Validate payment data before sending to backend
export const validatePaymentData = (paymentData) => {
  const errors = [];

  if (!paymentData.payment_id) {
    errors.push("PayPal payment ID is missing");
  }

  if (!paymentData.order_id) {
    errors.push("PayPal order ID is missing");
  }

  if (!paymentData.course_id) {
    errors.push("Course ID is missing");
  }

  if (
    !paymentData.expected_amount ||
    parseFloat(paymentData.expected_amount) <= 0
  ) {
    errors.push("Invalid payment amount");
  }

  if (!paymentData.payer_email || !paymentData.payer_email.includes("@")) {
    errors.push("Valid payer email is required");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

// Helper to get course details for payment
export const getCourseFromCart = (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return cartItems[0]; // Single course system
};
