// search-store.js
import axios from "axios";
import { create } from "zustand";

const useSearchStore = create((set) => ({
  isLoading: false,
  searchResults: [],

  getSearchResults: async (keyword) => {
    console.log(keyword, "keyword in store");
    set({ isLoading: true });

    try {
      const encoded = encodeURIComponent(keyword || "");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/search/${encoded}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      set({ isLoading: false, searchResults: response?.data?.data || [] });
      console.log("search result output : ", response?.data);
      return response.data;
    } catch (error) {
      console.error("search error:", error);
      set({ isLoading: false, searchResults: [] });
      return null;
    }
  },

  resetSearchResults: () => {
    set({ searchResults: [] });
  },
}));

export default useSearchStore;
