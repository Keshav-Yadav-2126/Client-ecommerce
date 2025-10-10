import axios from "axios";
import { create } from "zustand";

const useAdminOrderStore = create((set) => ({
  orderList: [],
  orderDetails: null,
  isLoading: false,

  getAllOrdersForAdmin: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/get`
      );
      
      if (response?.data?.success) {
        set({ orderList: response.data.data, isLoading: false });
      } else {
        set({ orderList: [], isLoading: false });
      }
    } catch (error) {
      console.error("Get all orders error:", error);
      set({ orderList: [], isLoading: false });
    }
  },

  getOrderDetailsForAdmin: async (orderId) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/details/${orderId}`
      );
      
      if (response?.data?.success) {
        set({ orderDetails: response.data.data, isLoading: false });
      } else {
        set({ orderDetails: null, isLoading: false });
      }
    } catch (error) {
      console.error("Get order details error:", error);
      set({ orderDetails: null, isLoading: false });
    }
  },

  updateOrderStatus: async ({ id, orderStatus }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
        { orderStatus }
      );
      
      return response.data;
    } catch (error) {
      console.error("Update order status error:", error);
      return { success: false, message: "Failed to update order status" };
    }
  },

  resetOrderDetails: () => set({ orderDetails: null }),
}));

export default useAdminOrderStore;