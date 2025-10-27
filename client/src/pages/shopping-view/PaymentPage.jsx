import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth-slice/auth-store";
import useOrderStore from "@/store/shop/order-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import CartItemContent from "@/components/shopping-view/cart-tem-content";
import { CreditCard, Loader2, AlertCircle, CheckCircle, Package, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createNewOrder, verifyPayment, razorpayConfig, clearRazorpayConfig } = useOrderStore();
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);

  // ✅ NEW: Delivery charge constants
  const DELIVERY_CHARGE = 100;
  const FREE_DELIVERY_THRESHOLD = 1500;

  useEffect(() => {
    // Retrieve order summary from localStorage
    const summary = localStorage.getItem("orderSummary");
    if (summary) {
      setOrderSummary(JSON.parse(summary));
    } else {
      // If no summary, redirect back to order summary page
      navigate("/shop/order-summary");
    }
  }, [navigate]);

  // ✅ NEW: Calculate delivery charges
  const calculateDeliveryCharge = () => {
    if (!orderSummary) return 0;
    return orderSummary.subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  };

  // ✅ NEW: Calculate final total with delivery
  const calculateFinalTotal = () => {
    if (!orderSummary) return 0;
    const deliveryCharge = calculateDeliveryCharge();
    return orderSummary.totalAmount + deliveryCharge;
  };

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
            localStorage.removeItem("selectedAddress");
            localStorage.removeItem("orderSummary");
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
        contact: orderSummary?.selectedAddress?.mobileNo || "",
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

  const handleInitiatePayment = async () => {
    if (!orderSummary) {
      toast.error("Order summary not found. Please try again.");
      return;
    }

    const userId = user?.id || user?._id;
    const buyNowProduct = localStorage.getItem("buyNowProduct");
    const isBuyNow = !!buyNowProduct;

    // ✅ NEW: Include delivery charges in total amount
    const deliveryCharge = calculateDeliveryCharge();
    const finalTotal = calculateFinalTotal();

    const orderData = {
      userId: userId,
      cartId: isBuyNow ? "" : orderSummary.items[0]?.cartId || "",
      cartItems: orderSummary.items.map((singleItem) => ({
        productId: singleItem?.productId || singleItem?.product,
        title: singleItem?.title,
        image: singleItem?.image,
        price: singleItem?.salePrice > 0 ? singleItem.salePrice : singleItem.price,
        quantity: singleItem?.quantity,
      })),
      addressInfo: {
        addressId: orderSummary.selectedAddress?._id,
        address: orderSummary.selectedAddress?.address,
        city: orderSummary.selectedAddress?.city,
        state: orderSummary.selectedAddress?.state,
        pincode: orderSummary.selectedAddress?.pincode,
        mobileNo: orderSummary.selectedAddress?.mobileNo || orderSummary.selectedAddress?.phone,
        notes: orderSummary.selectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      totalAmount: finalTotal, // ✅ UPDATED: Use final total with delivery charges
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

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
  };

  useEffect(() => {
    if (razorpayConfig && isPaymentStart && orderSummary) {
      const userId = user?.id || user?._id;
      const orderData = {
        userId,
        orderId: localStorage.getItem("CurrentOrderId")?.replace(/"/g, ""),
      };
      handleRazorpayPayment(orderData);
    }
  }, [razorpayConfig, isPaymentStart, orderSummary, user]);

  if (!orderSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-cream-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ NEW: Get calculated values
  const deliveryCharge = calculateDeliveryCharge();
  const finalTotal = calculateFinalTotal();
  const isFreeDelivery = deliveryCharge === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-cream-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment</h1>
          <p className="text-gray-600">Complete your payment to place the order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-lg">
              <CardHeader className="border-b border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Order Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {orderSummary.items && orderSummary.items.length > 0 ? (
                  <div className="space-y-4">
                    {orderSummary.items.map((item, index) => (
                      <CartItemContent key={index} cartItem={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No items in order</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Delivery Address */}
            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-lg">
              <CardHeader className="border-b border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Delivery Address</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-sm text-gray-700">
                  <p className="font-medium">{orderSummary.selectedAddress.address}</p>
                  <p>{orderSummary.selectedAddress.city}, {orderSummary.selectedAddress.state} - {orderSummary.selectedAddress.pincode}</p>
                  <p>Mobile: {orderSummary.selectedAddress.mobileNo || orderSummary.selectedAddress.phone || 'Not provided'}</p>
                  {orderSummary.selectedAddress.notes && <p className="mt-2 text-gray-600">Note: {orderSummary.selectedAddress.notes}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Final Price */}
            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-lg">
              <CardHeader className="border-b border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Payment Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span>Subtotal ({orderSummary.items.length} items)</span>
                    <span className="font-medium">₹{orderSummary.subtotal.toFixed(2)}</span>
                  </div>

                  {/* ✅ NEW: Delivery Charges */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Delivery Charges</span>
                    </div>
                    {isFreeDelivery ? (
                      <div className="flex items-center gap-2">
                        <span className="line-through text-gray-400">₹{DELIVERY_CHARGE}</span>
                        <Badge className="bg-green-100 text-green-700 border-green-300 text-xs font-semibold">
                          FREE
                        </Badge>
                      </div>
                    ) : (
                      <span className="font-medium">₹{deliveryCharge.toFixed(2)}</span>
                    )}
                  </div>

                  {/* ✅ NEW: Free delivery notice */}
                  {!isFreeDelivery && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-800">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        <span>
                          Add ₹{(FREE_DELIVERY_THRESHOLD - orderSummary.subtotal).toFixed(2)} more for FREE delivery
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ✅ NEW: Free delivery achieved notice */}
                  {isFreeDelivery && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-xs text-green-800">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="font-semibold">
                          🎉 You saved ₹{DELIVERY_CHARGE} on delivery!
                        </span>
                      </div>
                    </div>
                  )}

                  {/* GST - Commented out */}
                  {/* <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span>GST (18%)</span>
                      <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50 text-xs">
                        Tax
                      </Badge>
                    </div>
                    <span className="font-medium">₹{orderSummary.gstAmount.toFixed(2)}</span>
                  </div> */}

                  <Separator className="bg-yellow-200" />

                  {/* ✅ UPDATED: Total Amount with delivery */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{finalTotal.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500">Inclusive of all taxes</div>
                </div>
              </CardContent>
            </Card>

            {/* Pay Now Button */}
            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 border-0 shadow-xl">
              <CardContent className="p-6">
                <Button
                  onClick={handleInitiatePayment}
                  disabled={isPaymentStart}
                  className="w-full h-14 text-lg font-bold bg-white text-yellow-700 hover:bg-gray-100 shadow-lg disabled:bg-gray-200 disabled:text-gray-500"
                >
                  {isPaymentStart ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay ₹{finalTotal.toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="text-center text-white/90 text-sm mt-4">
                  Secure payment powered by Razorpay
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;