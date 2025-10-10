import axios from "axios";
import { create } from "zustand";

const useOrderStore = create((set) => ({
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  razorpayConfig: null,

  createNewOrder: async (orderData) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/order/create`,
        orderData
      );
      
      const { orderId, razorpayOrderId, amount, currency, key } = response?.data || {};

      set({ 
        isLoading: false, 
        orderId: orderId,
        razorpayConfig: {
          razorpayOrderId,
          amount,
          currency,
          key
        }
      });

      if (orderId) {
        localStorage.setItem("CurrentOrderId", JSON.stringify(orderId));
      }
      
      return response.data;
    } catch (error) {
      console.error("Create order error:", error.response?.data || error.message);
      set({ isLoading: false, orderId: null, razorpayConfig: null });
      return { success: false, message: error.response?.data?.message || "Failed to create order" };
    }
  },

  verifyPayment: async (paymentData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/order/verify`,
        paymentData
      );

      return response.data;
    } catch (error) {
      console.error("Verify payment error:", error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || "Payment verification failed" };
    }
  },

  getAllOrdersByUserId: async (userId) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`
      );
      
      if (response?.data) {
        set({ isLoading: false, orderList: response?.data?.data || [] });
      }
      return response.data;
    } catch (error) {
      console.error(error);
      set({ isLoading: false, orderList: [] });
      return { success: false, data: [] };
    }
  },

  getOrderDetails: async (id) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`
      );
      
      if (response?.data) {
        set({ isLoading: false, orderDetails: response?.data });
      }
      return response.data;
    } catch (error) {
      console.error(error);
      set({ isLoading: false, orderDetails: null });
      return null;
    }
  },

  resetOrderDetails: () => set({ orderDetails: null }),

  clearRazorpayConfig: () => set({ razorpayConfig: null }),

  // Refund order functionality
  refundOrder: async (orderId) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/order/refund/${orderId}`
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Refund failed' };
    }
  },
}));

export default useOrderStore;