import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  paymentStatus: null,
  orderId: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Replace any existing items with the new item (only one item at a time)
      state.items = [action.payload];
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },
    resetPaymentState: (state) => {
      state.paymentStatus = null;
      state.orderId = null;
      state.error = null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  setPaymentStatus,
  setOrderId,
  resetPaymentState,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items
    .reduce((total, item) => total + (item.price || 0), 0)
    .toFixed(2);
export const selectCartCount = (state) => state.cart.items.length;
export const selectPaymentStatus = (state) => state.cart.paymentStatus;
export const selectOrderId = (state) => state.cart.orderId;

export default cartSlice.reducer;
