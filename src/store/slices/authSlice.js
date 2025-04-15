import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user || null,
  csrfToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.csrfToken = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login success
      .addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.csrfToken = payload.csrfToken;
        localStorage.setItem("user", JSON.stringify(payload.user));
      })
      // Handle register success
      .addMatcher(
        api.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.csrfToken = payload.csrfToken;
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
