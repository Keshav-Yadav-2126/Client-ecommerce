import axios from "axios";
import { create } from "zustand";

const useShoppingStore = create((set) => ({
  isLoading: false,
  productList: [],
  productDetails: null,

  // ✅ Fetch products with filters & sorting
  fetchAllFilteredProducts: async (filterParams = {}, sortParams = "price-lowtohigh") => {
    console.log("🔄 Fetching products with filters:", filterParams, "and sort:", sortParams);
    set({ isLoading: true });

    const queryParts = [];
    for (const [key, value] of Object.entries(filterParams)) {
      if (value) {
        if (Array.isArray(value)) {
          queryParts.push(`${key}=${encodeURIComponent(value.join(","))}`);
        } else {
          queryParts.push(`${key}=${encodeURIComponent(value)}`);
        }
      }
    }

    if (sortParams) queryParts.push(`sortBy=${encodeURIComponent(sortParams)}`);

    const queryString = queryParts.join("&");
    console.log("🧩 Query String:", queryString);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/products/get?${queryString}`
      );

      if (response?.data) {
        set({ isLoading: false, productList: response.data.data || [] });
        console.log("✅ Products fetched:", response.data.data);
      }

      return response.data;
    } catch (error) {
      console.log("❌ Error fetching filtered products:", error);
      set({ isLoading: false, productList: [] });
      return null;
    }
  },

  // ✅ Fetch single product details
  fetchProductDetails: async (productId) => {
    set({ isLoading: true, productDetails: null });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/products/get/${productId}`
      );
      if (response?.data?.success) {
        set({ isLoading: false, productDetails: response.data.data });
        console.log("🟢 Product details:", response.data.data);
        return response.data.data;
      } else {
        set({ isLoading: false, productDetails: null });
        return null;
      }
    } catch (error) {
      console.log("❌ Error fetching product details:", error);
      set({ isLoading: false, productDetails: null });
      return null;
    }
  },

  // ✅ Search products
  searchProducts: async (searchTerm) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/search/${encodeURIComponent(searchTerm)}`
      );
      if (response?.data) {
        set({ isLoading: false, productList: response.data.data || [] });
        return response.data;
      }
    } catch (error) {
      console.log("❌ Error searching products:", error);
      set({ isLoading: false, productList: [] });
      return null;
    }
  },

  // ✅ Fetch featured products
  fetchFeaturedProducts: async (limit = 8) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/products/featured?limit=${limit}`
      );
      if (response?.data) {
        set({ isLoading: false, productList: response.data.data || [] });
        return response.data;
      }
    } catch (error) {
      console.log("❌ Error fetching featured products:", error);
      return await useShoppingStore.getState().fetchAllFilteredProducts({}, "price-lowtohigh");
    }
  },

  // ✅ Fetch by category
  fetchProductsByCategory: async (category) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/products/category/${encodeURIComponent(category)}`
      );
      if (response?.data) {
        set({ isLoading: false, productList: response.data.data || [] });
        return response.data;
      }
    } catch (error) {
      console.log("❌ Error fetching category products:", error);
      set({ isLoading: false });
      return null;
    }
  },

  // ✅ Fetch by brand
//   fetchProductsByBrand: async (brand) => {
//     set({ isLoading: true });
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_URL}/api/shop/products/brand/${encodeURIComponent(brand)}`
//       );
//       if (response?.data) {
//         set({ isLoading: false, productList: response.data.data || [] });
//         return response.data;
//       }
//     } catch (error) {
//       console.log("❌ Error fetching brand products:", error);
//       set({ isLoading: false });
//       return null;
//     }
//   },

  // ✅ Utility methods
  clearProductDetails: () => set({ productDetails: null }),
  clearProducts: () => set({ productList: [], productDetails: null, isLoading: false }),
  updateProductInList: (productId, updates) =>
    set((state) => ({
      productList: state.productList.map((p) =>
        p._id === productId ? { ...p, ...updates } : p
      ),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export default useShoppingStore;
