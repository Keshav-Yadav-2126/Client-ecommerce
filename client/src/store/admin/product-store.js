import axios from "axios";
import { create } from "zustand";

const useAdminStore = create((set) => ({
  isLoading: false,
  productList: [],

  addNewProduct: async (formData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/add`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      set({isLoading:false})
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

  fetchAllProduct: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/products/get`
      );
      
      if (response?.data) {
        set({isLoading:false, productList: response.data.data || []})
        console.log("All products: ", response.data);
      }
      return response.data;
    } catch (error) {
      console.log(error);
      set({isLoading:false, productList:[]})
      return null
    }
  },

  editProduct: async ({id, formData}) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );
      set({ isLoading: false });
      console.log("edited data : ", response.data)
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },

    deleteProduct: async ({id}) => {
    set({ isLoading: true });
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`
      );
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}));

export default useAdminStore;