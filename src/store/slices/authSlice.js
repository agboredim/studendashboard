import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";

// Load tokens from localStorage on app start
const loadTokensFromStorage = () => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const user = localStorage.getItem("user");

    return {
      accessToken,
      refreshToken,
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!accessToken,
    };
  } catch (error) {
    console.error("Failed to load tokens:", error);
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    };
  }
};

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  ...loadTokensFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { access, refresh, user_info } = action.payload;

      state.user = user_info;
      state.accessToken = access;
      state.refreshToken = refresh;
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("user", JSON.stringify(user_info));
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    updateTokens: (state, action) => {
      const { access, refresh } = action.payload;
      state.accessToken = access;
      if (refresh) state.refreshToken = refresh;

      localStorage.setItem("access_token", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);
    },

    addCourseToUser: (state, action) => {
      if (state.user) {
        if (!state.user.course) {
          state.user.course = [];
        }
        state.user.course.push(action.payload);
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // Handle login
      .addMatcher(api.endpoints.login.matchFulfilled, (state, { payload }) => {
        const { access, refresh, user_info } = payload;
        state.user = user_info;
        state.accessToken = access;
        state.refreshToken = refresh;
        state.isAuthenticated = true;

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user", JSON.stringify(user_info));
      })

      // Handle register
      .addMatcher(api.endpoints.register.matchFulfilled, (state, { payload }) => {
        const { access, refresh, user_info } = payload;
        state.user = user_info;
        state.accessToken = access;
        state.refreshToken = refresh;
        state.isAuthenticated = true;

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user", JSON.stringify(user_info));
      })

      // Handle Google auth
      .addMatcher(api.endpoints.googleAuth.matchFulfilled, (state, { payload }) => {
        const { access, refresh, user_info } = payload;
        state.user = user_info;
        state.accessToken = access;
        state.refreshToken = refresh;
        state.isAuthenticated = true;

        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        localStorage.setItem("user", JSON.stringify(user_info));
      })

      // Handle logout (auto clear)
      .addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
      });
  },
});

export const {
  login,
  logout,
  setUser,
  updateTokens,
  addCourseToUser,
} = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
