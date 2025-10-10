import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const AddressCard = ({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId
}) => {

  const isSelected = selectedId === addressInfo?._id;

  return (
    <Card 
      onClick={setCurrentSelectedAddress ? () => setCurrentSelectedAddress(addressInfo) : null} 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? "border-yellow-500 border-2 bg-yellow-50 shadow-lg" 
          : "border-gray-300 border hover:border-yellow-400 hover:shadow-md"
      }`}
    >
      <CardContent className="grid p-4 gap-2">
        <Label className="text-sm">
          <span className="font-semibold text-gray-700">Address:</span> {addressInfo?.address}
        </Label>
        <Label className="text-sm">
          <span className="font-semibold text-gray-700">City:</span> {addressInfo?.city}
        </Label>
        <Label className="text-sm">
          <span className="font-semibold text-gray-700">State:</span> {addressInfo?.state}
        </Label>
        <Label className="text-sm">
          <span className="font-semibold text-gray-700">Pincode:</span> {addressInfo?.pincode}
        </Label>
        <Label className="text-sm">
          <span className="font-semibold text-gray-700">Phone:</span> {addressInfo?.mobileNo || addressInfo?.phone}
        </Label>
        {addressInfo?.notes && (
          <Label className="text-sm">
            <span className="font-semibold text-gray-700">Notes:</span> {addressInfo?.notes}
          </Label>
        )}
      </CardContent>
      <CardFooter className="p-3 flex justify-between bg-gray-50 border-t">
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          variant="outline"
          size="sm"
          className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
        >
          Edit
        </Button>
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          variant="destructive"
          size="sm"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddressCard;