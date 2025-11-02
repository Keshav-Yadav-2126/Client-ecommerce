import Address from "@/components/shopping-view/Address";
import useCartStore from "@/store/shop/cart-store";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import useAuthStore from "@/store/auth-slice/auth-store.js";
import useOrderStore from "@/store/shop/order-store.js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import CartItemContent from "@/components/shopping-view/cart-tem-content";

const ShoppingCheckout = () => {
  const { cartItems } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const { createNewOrder, verifyPayment, razorpayConfig, clearRazorpayConfig } =
    useOrderStore();
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  const items = Array.isArray(cartItems) ? cartItems : cartItems?.items || [];

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      (item.salePrice > 0
        ? item.salePrice * item.quantity
        : item.price * item.quantity),
    0
  );

  const gstRate = 0.18;
  const gstAmount = subtotal * gstRate;
  const totalAmount = subtotal + gstAmount;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderData) => {
    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Please check your internet connection.");
      setIsPaymentStart(false);
      return;
    }

    const options = {
      key: razorpayConfig.key,
      amount: razorpayConfig.amount,
      currency: razorpayConfig.currency,
      name: "Pachory",
      description: "Organic Nutrition Store",
      order_id: razorpayConfig.razorpayOrderId,
      handler: async function (response) {
        try {
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData.orderId,
          };

          const result = await verifyPayment(verificationData);

          if (result.success) {
            localStorage.removeItem("CurrentOrderId");
            clearRazorpayConfig();
            toast.success("Payment successful!");
            navigate("/shop/payment-success");
          } else {
            toast.error(result.message || "Payment verification failed");
            setIsPaymentStart(false);
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed");
          setIsPaymentStart(false);
        }
      },
      prefill: {
        name: user?.name || user?.userName,
        email: user?.email,
        contact: currentSelectedAddress?.phone || "",
      },
      theme: {
        color: "#F59E0B",
      },
      modal: {
        ondismiss: function () {
          setIsPaymentStart(false);
          toast.info("Payment cancelled");
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  async function handleInitiatePayment() {
    if (items.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed");
      return;
    }

    if (currentSelectedAddress === null) {
      toast.error("Please select one address to proceed.");
      return;
    }

    const userId = user?.id || user?._id;

    const orderData = {
      userId: userId,
      cartId: cartItems?._id,
      cartItems: items.map((singleItem) => ({
        productId: singleItem?.productId || singleItem?.product,
        title: singleItem?.title,
        image: singleItem?.image,
        price:
          singleItem?.salePrice > 0 ? singleItem.salePrice : singleItem.price,
        quantity: singleItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        state: currentSelectedAddress?.state,
        pincode: currentSelectedAddress?.pincode,
        mobileNo: currentSelectedAddress?.mobileNo || currentSelectedAddress?.phone,
        phone: currentSelectedAddress?.phone || currentSelectedAddress?.mobileNo,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      totalAmount: totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      customerName: user?.userName || user?.name,  // ✅ ADDED
      customerEmail: user?.email,
    };

    console.log("Order data being sent:", orderData);

    try {
      setIsPaymentStart(true);
      const data = await createNewOrder(orderData);

      if (data?.success) {
        toast.success("Order created! Opening payment gateway...");
        orderData.orderId = data.orderId;
      } else {
        setIsPaymentStart(false);
        toast.error(data?.message || "Failed to create order. Please try again.");
      }
    } catch (error) {
      setIsPaymentStart(false);
      toast.error("Error creating order. Please try again.");
      console.error("Order creation error:", error);
    }
  }

  useEffect(() => {
    if (razorpayConfig && isPaymentStart) {
      const userId = user?.id || user?._id;
      const orderData = {
        userId,
        orderId: localStorage.getItem("CurrentOrderId")?.replace(/"/g, ""),
      };
      handleRazorpayPayment(orderData);
    }
  }, [razorpayConfig]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-cream-50">
      {/* Header Banner */}
      <div className="relative h-40 sm:h-48 md:h-60 lg:h-64 w-full overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-center justify-center px-3">
          <div className="text-center text-white">
            <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-3 sm:mb-4" />
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-1 sm:mb-2">Checkout</h1>
            <p className="text-sm sm:text-base md:text-lg">Complete your order</p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-5 sm:py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 gap-4 sm:gap-0 shadow-lg border border-yellow-200">
            {/* Step 1 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                  currentSelectedAddress ? "bg-green-500" : "bg-yellow-500"
                } text-white font-bold`}
              >
                {currentSelectedAddress ? <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" /> : "1"}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Address</p>
                <p className="text-xs sm:text-sm text-gray-600">Select delivery address</p>
              </div>
            </div>

            <ArrowRight className="hidden sm:block w-5 sm:w-6 h-5 sm:h-6 text-gray-400" />

            {/* Step 2 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                  items.length > 0 ? "bg-green-500" : "bg-gray-300"
                } text-white font-bold`}
              >
                {items.length > 0 ? <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" /> : "2"}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Cart</p>
                <p className="text-xs sm:text-sm text-gray-600">Review items</p>
              </div>
            </div>

            <ArrowRight className="hidden sm:block w-5 sm:w-6 h-5 sm:h-6 text-gray-400" />

            {/* Step 3 */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">Payment</p>
                <p className="text-xs sm:text-sm text-gray-600">Complete payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Address Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-lg">
              <CardHeader className="border-b border-yellow-200 px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl">Delivery Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Address
                  selectedId={currentSelectedAddress?._id}
                  setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-6 space-y-4 sm:space-y-6">
              {/* Cart Items */}
              <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-lg">
                <CardHeader className="border-b border-yellow-200 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <Package className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {items && items.length > 0 ? (
                    <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                      {items.map((item, index) => (
                        <CartItemContent key={index} cartItem={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <AlertCircle className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm sm:text-base text-gray-600">Your cart is empty</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Price Details */}
              <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-lg">
                <CardHeader className="border-b border-yellow-200 px-4 sm:px-6 py-3 sm:py-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl">Price Details</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal ({items.length} items)</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-700">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span>GST (18%)</span>
                        <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50 text-[10px] sm:text-xs">
                          Tax
                        </Badge>
                      </div>
                      <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                    </div>

                    <Separator className="bg-yellow-200" />

                    <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
                    </div>

                    {items.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 mt-2 sm:mt-4">
                        <p className="text-xs sm:text-sm text-green-800 flex items-center gap-1 sm:gap-2">
                          <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4" />
                          GST invoice will be generated after payment
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Button */}
              <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 border-0 shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  {!currentSelectedAddress && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 text-white text-xs sm:text-sm">
                      <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                      Please select a delivery address
                    </div>
                  )}

                  <Button
                    onClick={handleInitiatePayment}
                    disabled={isPaymentStart || items.length === 0 || !currentSelectedAddress}
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-white text-yellow-700 hover:bg-gray-100 shadow-lg disabled:bg-gray-200 disabled:text-gray-500"
                  >
                    {isPaymentStart ? (
                      <>
                        <Loader2 className="w-4 sm:w-5 h-4 sm:h-5 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                        Pay ₹{totalAmount.toFixed(2)}
                      </>
                    )}
                  </Button>

                  <p className="text-center text-white/90 text-xs sm:text-sm mt-3 sm:mt-4">
                    Secure payment powered by Razorpay
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
