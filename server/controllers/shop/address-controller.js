import Address from "../../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    const { userId, address, city, state, pincode, mobileNo, notes } = req.body;

    if (!userId || !address || !city || !state || !pincode || !mobileNo) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided! All required fields must be filled.",
      });
    }

    const newlyCreatedAddress = new Address({
      userId,
      address,
      city,
      state,
      pincode,
      mobileNo,
      notes: notes || "",
    });

    await newlyCreatedAddress.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
      message: "Address successfully added",
    });
  } catch (e) {
    console.log("Add address error:", e);
    res.status(500).json({
      success: false,
      message: "Error adding address",
    });
  }
};

export const fetchAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required!",
      });
    }

    const addressList = await Address.find({ userId });

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    console.log("Fetch address error:", e);
    res.status(500).json({
      success: false,
      message: "Error fetching addresses",
    });
  }
};

export const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    console.log("Edit address - UserId:", userId, "AddressId:", addressId);
    console.log("Form data:", formData);

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: address,
      message: "Address updated successfully",
    });
  } catch (e) {
    console.log("Edit address error:", e);
    res.status(500).json({
      success: false,
      message: "Error updating address",
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    const address = await Address.findOneAndDelete({ _id: addressId, userId });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (e) {
    console.log("Delete address error:", e);
    res.status(500).json({
      success: false,
      message: "Error deleting address",
    });
  }
};