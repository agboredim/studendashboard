import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import { api } from "../services/api";
import { coursesApi } from "../services/coursesApi";
import { liveClassesApi } from "@/services/live-classes-api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [api.reducerPath]: api.reducer,
    [coursesApi.reducerPath]: coursesApi.reducer,
    [liveClassesApi.reducerPath]: liveClassesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(coursesApi.middleware)
      .concat(liveClassesApi.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

export default store;
