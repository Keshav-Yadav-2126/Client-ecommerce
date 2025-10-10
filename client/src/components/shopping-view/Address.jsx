import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FormInput } from "../common/form";
import { addressFormControls } from "@/config";
import useAddressStore from "@/store/shop/address-store";
import useAuthStore from "@/store/auth-slice/auth-store";
import { toast } from "sonner";
import AddressCard from "./address-card";

const initialAddressFormData = {
  address: "",
  city: "",
  state: "",
  mobileNo: "",
  pincode: "",
  notes: "",
};

const Address = ({ setCurrentSelectedAddress, selectedId }) => {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const {
    addNewAddress,
    fetchAddress,
    addressList,
    deleteAddress,
    editAddress,
  } = useAddressStore();
  const { user } = useAuthStore();

  async function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast("You can add max 3 addresses", {
        duration: 2000,
      });
      return;
    }

    if (currentEditedId !== null) {
      const data = await editAddress(user?.id, currentEditedId, formData);
      await fetchAddress(user?.id);
      setCurrentEditedId(null);
      setFormData(initialAddressFormData);
      toast(data?.message, {
        duration: 2000,
        icon: "✔",
      });
    } else {
      const data = await addNewAddress({ ...formData, userId: user?.id });
      await fetchAddress(user?.id);
      setFormData(initialAddressFormData);
      toast(data?.message, {
        duration: 1000,
        icon: "✔",
      });
    }
  }

  function isValidMobile(mobileNo) {
    // Accepts 10 digit numbers only
    if (!mobileNo) return false;
    return /^\d{10}$/.test(mobileNo.trim());
  }

  function isFormValid() {
    // Required fields (notes is optional)
    const requiredFields = ['address', 'city', 'state', 'pincode', 'mobileNo'];
    
    // Check if all required fields are filled
    const allFilled = requiredFields.every(key => {
      const value = formData[key];
      return value && value.trim() !== "";
    });
    
    // Mobile number must be valid
    const mobileValid = isValidMobile(formData.mobileNo);
    
    return allFilled && mobileValid;
  }

  async function handleDeleteAddress(getCurrentAddress) {
    const data = await deleteAddress(user?.id, getCurrentAddress._id);
    if (data?.success) {
      await fetchAddress(user?.id);
    }
  }

  async function handleEditAddress(getCurrentAddress) {
    console.log(getCurrentAddress._id);
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      state: getCurrentAddress?.state,
      mobileNo: getCurrentAddress?.mobileNo,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
  }

  useEffect(() => {
    fetchAddress(user?.id);
  }, []);

  console.log("current Selected address : ", setCurrentSelectedAddress);

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormInput
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
        {formData.mobileNo && !isValidMobile(formData.mobileNo) && (
          <div className="text-red-600 text-sm">
            Mobile number must be exactly 10 digits.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Address;