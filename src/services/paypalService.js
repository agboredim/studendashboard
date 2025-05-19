// Format the cart items for PayPal
export const formatItemsForPayPal = (cartItems) => {
  return cartItems.map((item) => ({
    name: item.name,
    description: item.description?.substring(0, 127) || "Course",
    sku: item.id.toString(),
    unit_amount: {
      currency_code: "GBP",
      value: item.price.toString(),
    },
    quantity: "1",
    category: "DIGITAL_GOODS",
  }));
};

// Calculate order total
export const calculateOrderTotal = (cartItems) => {
  return cartItems
    .reduce((total, item) => total + (item.price || 0), 0)
    .toFixed(2);
};

// Format the order for backend processing
export const formatOrderForBackend = (
  cartItems,
  paypalOrderData,
  paypalPaymentData
) => {
  return {
    order_items: cartItems.map((item) => ({
      course_id: item.id,
      price: item.price,
    })),
    payment_details: {
      payment_method: "paypal",
      payment_id: paypalPaymentData.id,
      order_id: paypalOrderData.id,
      status: paypalPaymentData.status,
      amount: calculateOrderTotal(cartItems),
      currency: "GBP",
      payer_email: paypalPaymentData.payer?.email_address || "",
      payer_id: paypalPaymentData.payer?.payer_id || "",
    },
  };
};
