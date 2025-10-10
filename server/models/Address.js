import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    userId: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    mobileNo: String,  // Changed from 'phone' to 'mobileNo'
    notes: String,
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", AddressSchema);
export default Address;