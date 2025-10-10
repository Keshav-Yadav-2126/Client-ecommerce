import axios from "axios";
import { create } from "zustand";

const useAdminRefundStore = create((set) => ({
  isLoading: false,
  refundRequests: [],

  fetchAllRefundRequests: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/refund/all`
      );
      set({ 
        isLoading: false, 
        refundRequests: response.data.data || [] 
      });
      return response.data;
    } catch (error) {
      console.error("Fetch refunds error:", error);
      set({ isLoading: false, refundRequests: [] });
      return { success: false, data: [] };
    }
  },

  updateRefundStatus: async (refundId, status, adminComment = "") => {
    set({ isLoading: true });
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shop/refund/update/${refundId}`,
        { status, adminComment }
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Update refund error:", error);
      set({ isLoading: false });
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to update refund status" 
      };
    }
  },
}));

export default useAdminRefundStore;