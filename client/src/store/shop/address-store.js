import axios from "axios";
import { create } from "zustand";

const useAddressStore = create((set) => ({
  isLoading: false,
  addressList: [],

  addNewAddress: async (formData) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/address/add`,formData
      );
      console.log("Address added", response);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      return null;
    }
  },
  fetchAddress: async (userId) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/address/get/${userId}`
      );
      console.log("all Address", response);
      set({ isLoading: false, addressList: response.data.data });
      return response.data;
    } catch (error) {
      console.log(error);
      set({ isLoading: false, addressList: [] });
      return null;
    }
  },
  editAddress: async (userId, addressId, formData) => {
    try {
      set({ isLoading: true });
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shop/address/update/${userId}/${addressId}`,formData);
      console.log("Address update", response.data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      return null;
    }
  },
  deleteAddress: async (userId, addressId) => {
    try {
      set({ isLoading: true });
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shop/address/delete/${userId}/${addressId}`
      );
      console.log("Address delete", response);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.log(error);
      set({ isLoading: false });
      return null;
    }
  },
}));

export default useAddressStore;
