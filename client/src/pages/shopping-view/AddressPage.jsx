import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Address from "@/components/shopping-view/Address";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MapPin } from "lucide-react";

const AddressPage = () => {
  const navigate = useNavigate();
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

  const handleContinue = () => {
    if (currentSelectedAddress) {
      // Store selected address in localStorage for next page
      localStorage.setItem("selectedAddress", JSON.stringify(currentSelectedAddress));
      // Check if this is a buy now flow or cart checkout
      const buyNowProduct = localStorage.getItem("buyNowProduct");
      if (buyNowProduct) {
        navigate("/shop/order-summary");
      } else {
        navigate("/shop/order-summary");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-cream-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Select Delivery Address</h1>
          <p className="text-gray-600">Choose where you want your order delivered</p>
        </div>

        {/* Address Selection */}
        <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-lg">
          <CardHeader className="border-b border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Delivery Address</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Address
              selectedId={currentSelectedAddress?._id}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!currentSelectedAddress}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue to Order Summary
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressPage;
