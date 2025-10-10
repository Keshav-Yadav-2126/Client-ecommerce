import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const useReviewStore = create((set) => ({
  reviews: [],
  isLoading: false,
  canReview: false,
  hasPurchased: false,
  hasReviewed: false,

  // Get all reviews for a product (approved only)
  getReviews: async (productId) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`${API_URL}/api/shop/review/${productId}`);
      
      if (response.data.success) {
        set({ reviews: response.data.data, isLoading: false });
        return response.data;
      }
      
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      set({ isLoading: false, reviews: [] });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch reviews'
      };
    }
  },

  // Check if user can review a product
  checkCanReview: async (productId, userId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/shop/review/can-review/${productId}/${userId}`
      );
      
      if (response.data.success) {
        set({ 
          canReview: response.data.canReview,
          hasPurchased: response.data.hasPurchased,
          hasReviewed: response.data.hasReviewed
        });
        return response.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      set({ canReview: false, hasPurchased: false, hasReviewed: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check review eligibility'
      };
    }
  },

  // Add a new review
  addReview: async (reviewData) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(
        `${API_URL}/api/shop/review/add`, 
        reviewData,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        set({ isLoading: false });
        return response.data;
      }
      
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      set({ isLoading: false });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add review'
      };
    }
  },

  // Clear reviews (useful when navigating away)
  clearReviews: () => set({ 
    reviews: [], 
    canReview: false, 
    hasPurchased: false, 
    hasReviewed: false 
  }),
}));

export default useReviewStore;