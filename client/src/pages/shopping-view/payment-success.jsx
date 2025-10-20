import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import useCartStore from "@/store/shop/cart-store";
import { CheckCircle, Package, Home } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  // Clear cart on mount (when payment is successful)
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-yellow-200 shadow-2xl">
        <CardContent className="pt-8 pb-8 px-6 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
              Payment Successful!
            </CardTitle>
            <p className="text-gray-600 text-base">
              Your order has been confirmed and is being processed.
            </p>
          </CardHeader>

          {/* Divider */}
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto mb-6"></div>

          {/* Info Text */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 mb-6 border border-yellow-200">
            <p className="text-sm text-gray-700">
              Thank you for shopping with <span className="font-bold text-yellow-600">Pachory</span>!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg text-base font-bold rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
              onClick={() => navigate("/shop/account")}
            >
              <Package className="w-5 h-5 mr-2" />
              View Orders
            </Button>
            
            <Button 
              variant="outline"
              className="w-full h-12 border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50 text-base font-semibold rounded-lg"
              onClick={() => navigate("/shop/home")}
            >
              <Home className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;