import axios from "axios";
import { create } from "zustand";

const useRefundStore = create((set) => ({
  isLoading: false,
  refundRequests: [],

  createRefundRequest: async (data) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/refund/create`,
        data
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || "Refund request failed" };
    }
  },

  getUserRefundRequests: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/refund/user/${userId}`
      );
      set({ isLoading: false, refundRequests: response.data.data || [] });
      return response.data;
    } catch (error) {
      set({ isLoading: false, refundRequests: [] });
      return { success: false, message: error.response?.data?.message || "Failed to fetch refund requests" };
    }
  },
}));

export default useRefundStore;
