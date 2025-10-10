// auth-store.js
import axios from "axios";
import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,

  registerUser: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      // API call
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData,
        { withCredentials: true }
      );
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : "Registration Failed";
      console.error("Registration failed:", error);
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: errorMsg,
      });
      return { success: false, message: errorMsg };
    }
  },

  loginUser: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
        { withCredentials: true }
      );
      if (response.data?.user && response.data?.token) {
        localStorage.setItem("token", response.data.token);
        set({
          isLoading: false,
          user: response.data.user,
          isAuthenticated: true,
          error: null,
        });
      } else {
        set({ isLoading: false, user: null, isAuthenticated: false });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : "Login Failed";
      set({ isAuthenticated: false, isLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email },
        { withCredentials: true }
      );
      set({ isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : "Password reset failed";
      set({ isLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        { token, newPassword },
        { withCredentials: true }
      );
      set({ isLoading: false, error: null });
      return response.data;
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : "Password reset failed";
      set({ isLoading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  logoutUser: () => {
      localStorage.removeItem("token");
      set({isAuthenticated: false, user: null})
  },

  authChecker: async () => {
    set({ isLoading: true, error: null });
    const token = localStorage.getItem("token");

     if (!token || token === "null" || token === "undefined") {
    set({ isAuthenticated: false, user: null, isLoading: false });
    return;
  }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const data = response.data;
      if (data.user) {
        set({
          isAuthenticated: true,
          user: data.user,
          isLoading: false,
          error: null,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      const errorMsg = error.response
        ? error.response.data.message
        : "Authentication Check Failed";
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: errorMsg,
      });
    }
  },
}));

export default useAuthStore;