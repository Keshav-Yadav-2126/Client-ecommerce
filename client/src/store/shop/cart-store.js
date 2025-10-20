//cart-store.js
import axios from "axios";
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cartItems: { items: [] },
  isLoading: false,
  error: null,
  totalAmount: 0,
  totalItems: 0,

  // Calculate totals from cart items
  calculateTotals: () => {
    const { cartItems } = get();
    let items = [];
    
    if (Array.isArray(cartItems)) {
      items = cartItems;
    } else if (cartItems && Array.isArray(cartItems.items)) {
      items = cartItems.items;
    }

    const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalAmount = items.reduce((sum, item) => {
      const price = item.product?.salePrice > 0 ? item.product.salePrice : item.product?.price || 0;
      return sum + (price * (item.quantity || 0));
    }, 0);

    set({ totalItems, totalAmount });
  },

  addToCart: async ({ userId, productId, quantity }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/add`,
        { userId, productId, quantity },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      );

      if (response.data?.success) {
        // Fetch updated cart items after adding
        await get().fetchCartItems({ userId });
        set({ isLoading: false });
        return response.data;
      } else {
        set({ isLoading: false, error: response.data?.message || 'Failed to add item to cart' });
        return { success: false, message: response.data?.message || 'Failed to add item to cart' };
      }
    } catch (error) {
      console.error("Add to cart error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Network error occurred';
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  fetchCartItems: async ({ userId }) => {
    // Prevent multiple simultaneous fetches
    const currentState = get();
    if (currentState.isLoading) return currentState.cartItems;
    
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`,
        { withCredentials: true }
      );
      
      if (response.data?.success) {
        const cartData = response.data.data || { items: [] };
        set({ 
          isLoading: false, 
          cartItems: cartData,
          error: null
        });
        
        // Calculate totals after fetching
        setTimeout(() => get().calculateTotals(), 0);
        
        return cartData;
      } else {
        set({ isLoading: false, cartItems: { items: [] }, error: response.data?.message });
        return { items: [] };
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch cart';
      set({ isLoading: false, cartItems: { items: [] }, error: errorMessage });
      return { items: [] };
    }
  },

  deleteCartItem: async ({ userId, productId }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/${userId}/${productId}`,
        { withCredentials: true }
      );
      
      if (response.data?.success) {
        const cartData = response.data.data || { items: [] };
        set({ 
          isLoading: false, 
          cartItems: cartData,
          error: null
        });
        
        // Calculate totals after deletion
        setTimeout(() => get().calculateTotals(), 0);
        
        return response.data;
      } else {
        set({ isLoading: false, error: response.data?.message || 'Failed to remove item' });
        return { success: false, message: response.data?.message || 'Failed to remove item' };
      }
    } catch (error) {
      console.error("Delete cart item error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to remove item';
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  updateCartQty: async ({ userId, productId, quantity }) => {
    // Optimistically update the UI first for better UX
    const currentItems = get().cartItems;
    const updatedItems = { ...currentItems };
    
    if (updatedItems.items) {
      const itemIndex = updatedItems.items.findIndex(
        item => (item.productId || item.product?._id) === productId
      );
      
      if (itemIndex !== -1) {
        updatedItems.items[itemIndex].quantity = quantity;
        set({ cartItems: updatedItems });
        // Recalculate totals optimistically
        get().calculateTotals();
      }
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
        { userId, productId, quantity },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      );
      
      if (response.data?.success) {
        const cartData = response.data.data || { items: [] };
        set({ 
          isLoading: false, 
          cartItems: cartData,
          error: null
        });
        
        // Calculate totals after update
        setTimeout(() => get().calculateTotals(), 0);
        
        return response.data;
      } else {
        // Revert optimistic update on failure
        set({ isLoading: false, cartItems: currentItems, error: response.data?.message });
        get().calculateTotals();
        return { success: false, message: response.data?.message || 'Failed to update quantity' };
      }
    } catch (error) {
      console.error("Update cart quantity error:", error);
      // Revert optimistic update on error
      const errorMessage = error.response?.data?.message || 'Failed to update quantity';
      set({ isLoading: false, cartItems: currentItems, error: errorMessage });
      get().calculateTotals();
      return { success: false, message: errorMessage };
    }
  },

  // Batch update multiple items (useful for checkout)
  updateMultipleItems: async ({ userId, updates }) => {
    set({ isLoading: true, error: null });
    try {
      const promises = updates.map(({ productId, quantity }) =>
        get().updateCartQty({ userId, productId, quantity })
      );
      
      const results = await Promise.all(promises);
      const hasError = results.some(result => !result.success);
      
      if (hasError) {
        set({ error: 'Some items could not be updated' });
        return { success: false, message: 'Some items could not be updated' };
      }
      
      return { success: true, message: 'Cart updated successfully' };
    } catch (error) {
      console.error("Batch update error:", error);
      const errorMessage = 'Failed to update cart items';
      set({ isLoading: false, error: errorMessage });
      return { success: false, message: errorMessage };
    }
  },

  // Get cart item by product ID
  getCartItem: (productId) => {
    const { cartItems } = get();
    let items = [];
    
    if (Array.isArray(cartItems)) {
      items = cartItems;
    } else if (cartItems && Array.isArray(cartItems.items)) {
      items = cartItems.items;
    }
    
    return items.find(item => 
      (item.productId || item.product?._id) === productId
    );
  },

  // Check if product is in cart
  isInCart: (productId) => {
    return !!get().getCartItem(productId);
  },

  // Get cart item count for specific product
  getItemQuantity: (productId) => {
    const item = get().getCartItem(productId);
    return item?.quantity || 0;
  },

  // Clear cart (useful for logout or after successful order)
  clearCart: () => {
    set({ 
      cartItems: { items: [] }, 
      isLoading: false, 
      error: null,
      totalAmount: 0,
      totalItems: 0
    });
  },

  // Clear only error state
  clearError: () => {
    set({ error: null });
  },

  // Validate cart items (check stock availability)
  validateCart: async ({ userId }) => {
    const { cartItems } = get();
    let items = [];
    
    if (Array.isArray(cartItems)) {
      items = cartItems;
    } else if (cartItems && Array.isArray(cartItems.items)) {
      items = cartItems.items;
    }

    if (items.length === 0) {
      return { valid: true, issues: [] };
    }

    // Refresh cart to get latest data
    await get().fetchCartItems({ userId });
    
    const issues = [];
    const updatedState = get();
    const currentItems = updatedState.cartItems?.items || [];
    
    currentItems.forEach(item => {
      const product = item.product;
      if (!product) {
        issues.push({
          productId: item.productId,
          issue: 'Product no longer available',
          severity: 'error'
        });
      } else if (product.stock < item.quantity) {
        issues.push({
          productId: item.productId,
          productName: product.title,
          issue: `Only ${product.stock} items available, you have ${item.quantity} in cart`,
          severity: 'warning',
          availableStock: product.stock
        });
      }
    });

    return {
      valid: issues.length === 0,
      issues: issues
    };
  },
  
}));

export default useCartStore;