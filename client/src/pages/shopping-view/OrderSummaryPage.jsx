import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "@/store/shop/cart-store";
import useAuthStore from "@/store/auth-slice/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import CartItemContent from "@/components/shopping-view/cart-tem-content";
import { ArrowRight, Package, MapPin, CreditCard, AlertCircle } from "lucide-react";

const OrderSummaryPage = () => {
  const navigate = useNavigate();
  const { cartItems, fetchCartItems, updateCartQuantity, deleteCartItem } = useCartStore();
  const { user } = useAuthStore();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [localItems, setLocalItems] = useState([]);

  useEffect(() => {
    // Retrieve selected address from localStorage
    const address = localStorage.getItem("selectedAddress");
    if (address) {
      setSelectedAddress(JSON.parse(address));
    } else {
      // If no address, redirect back to address page
      navigate("/shop/address");
    }

    // Initialize local items for cart management
    const buyNowProduct = localStorage.getItem("buyNowProduct");
    const isBuyNow = !!buyNowProduct;

    if (isBuyNow) {
      const product = JSON.parse(buyNowProduct);
      setLocalItems([{ ...product, quantity: product.quantity || 1 }]);
    } else {
      // Fetch cart items if user is logged in
      if (user?.id) {
        fetchCartItems({ userId: user.id });
      }
      const cartData = Array.isArray(cartItems) ? cartItems : cartItems?.items || [];
      setLocalItems(cartData);
    }
  }, [navigate, cartItems, user?.id, fetchCartItems]);

  // Check if this is a buy now flow or cart checkout
  const buyNowProduct = localStorage.getItem("buyNowProduct");
  const isBuyNow = !!buyNowProduct;

  // Use localItems for cart management, but items for display
  const items = isBuyNow
    ? localItems
    : Array.isArray(cartItems) ? cartItems : cartItems?.items || [];

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

  // Handle quantity update for cart items
  const handleUpdateQuantity = (productId, quantity) => {
    if (isBuyNow) {
      // For buy now, update local items and localStorage
      const updatedItems = localItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      setLocalItems(updatedItems);
      localStorage.setItem("buyNowProduct", JSON.stringify(updatedItems[0]));
    } else {
      // For cart checkout, update store
      updateCartQuantity(productId, quantity);
    }
  };

  // Handle delete item
  const handleDeleteItem = (productId) => {
    if (isBuyNow) {
      // Check if this is the buy now item being deleted
      const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));
      const isDeletingBuyNowItem = buyNowProduct && (buyNowProduct.productId === productId || buyNowProduct._id === productId);

      if (isDeletingBuyNowItem) {
        // Remove buy now item from localItems
        const updatedItems = localItems.filter(item =>
          (item.productId || item._id) !== productId
        );
        setLocalItems(updatedItems);
        localStorage.removeItem("buyNowProduct");

        // If no items left after removing buy now item, redirect to shop
        if (updatedItems.length === 0) {
          navigate("/shop/home");
        }
      } else {
        // Deleting a cart item during buy now flow
        deleteCartItem(productId);
      }
    } else {
      // For cart checkout, delete from store
      deleteCartItem(productId);
    }
  };

  const handleProceedToPayment = () => {
    // Store order summary data in localStorage for payment page
    const orderData = {
      items: localItems, // Use localItems for order data to include any updates
      subtotal,
      gstAmount,
      totalAmount,
      selectedAddress,
    };
    localStorage.setItem("orderSummary", JSON.stringify(orderData));
    navigate("/shop/payment");
  };

  if (!selectedAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-cream-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-cream-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Summary</h1>
          <p className="text-gray-600">Review your order before proceeding to payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-lg">
              <CardHeader className="border-b border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">Order Items</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {items && items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <CartItemContent
                        key={item.productId || item._id || index}
                        cartItem={item}
                        handleUpdateQuantity={isBuyNow ? handleUpdateQuantity : undefined}
                        handleDeleteItem={isBuyNow ? handleDeleteItem : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Your cart is empty</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
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
                  <p className="font-medium">{selectedAddress.address}</p>
                  <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                  {/* New mobile display with fallback */}
                  <p>Mobile: {selectedAddress.mobileNo || selectedAddress.phone || 'Not provided'}</p>
                  {selectedAddress.notes && <p className="mt-2 text-gray-600">Note: {selectedAddress.notes}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Price Details */}
            <Card className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-lg">
              <CardHeader className="border-b border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Price Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span>GST (18%)</span>
                      <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50 text-xs">
                        Tax
                      </Badge>
                    </div>
                    <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-yellow-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proceed Button */}
            <Button
              onClick={handleProceedToPayment}
              disabled={items.length === 0}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Proceed to Payment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
