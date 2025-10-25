import React from "react";
import { SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import CartItemContent from "../shopping-view/cart-tem-content";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowRight, Package, Sparkles, LogIn } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import useAuthStore from "@/store/auth-slice/auth-store";

const CartWrapper = ({ cartItems, setOpenCartSheet }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const items = Array.isArray(cartItems) ? cartItems : (cartItems?.items || []);
  
  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice > 0 ? item.salePrice : item.price;
    return sum + (price * item.quantity);
  }, 0);

  const gstRate = 0.05; // 5% GST
  const gstAmount = subtotal * gstRate;
  const totalAmount = subtotal + gstAmount;
  
  // Commented out old single-page checkout navigation
  // const handleCheckout = () => {
  //   setOpenCartSheet(false);
  //   navigate("/shop/checkout");
  // };

  // New multi-page checkout navigation with authentication check
  const handleCheckout = () => {
    setOpenCartSheet(false);
    
    // ✅ NEW: Check if user is authenticated
    if (!isAuthenticated || !user) {
      navigate("/auth/login");
    } else {
      navigate("/shop/address");
    }
  };

  // ✅ NEW: Handle login navigation for empty cart
  const handleEmptyCartAction = () => {
    setOpenCartSheet(false);
    
    // If not authenticated, go to login
    if (!isAuthenticated || !user) {
      navigate("/auth/login");
    } else {
      // If authenticated, go to shop listing
      navigate("/shop/listing");
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white/95">
      {/* Header */}
      <SheetHeader className="border-b border-yellow-200 pb-5 px-1">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <SheetTitle className="text-2xl sm:text-3xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-bold">
              Your Cart
            </SheetTitle>
            {items.length > 0 && (
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                {items.length} {items.length === 1 ? 'item' : 'items'} ready
              </p>
            )}
          </div>
        </div>
      </SheetHeader>

      {/* Empty Cart State */}
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Package className="w-12 h-12 sm:w-14 sm:h-14 text-yellow-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 text-center mb-6 text-sm sm:text-base max-w-xs">
            {/* ✅ NEW: Different message based on authentication */}
            {!isAuthenticated || !user 
              ? "Login to start shopping and discover our organic products!"
              : "Discover our organic products and start your healthy journey!"
            }
          </p>
          <Button 
            onClick={handleEmptyCartAction}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            {/* ✅ NEW: Different button text based on authentication */}
            {!isAuthenticated || !user ? (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Login to Shop
              </>
            ) : (
              <>
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4 px-1 space-y-3 sm:space-y-4">
            {items.map((item) => (
              <CartItemContent
                key={item._id || item.productId || item.product}
                cartItem={item}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="border-t-2 border-yellow-200 pt-5 pb-6 px-1 space-y-4 bg-gradient-to-br from-yellow-50/30 to-orange-50/30">
            <div className="space-y-3 bg-white rounded-xl p-4 shadow-md border border-yellow-200">
              {/* Subtotal */}
              <div className="flex justify-between text-gray-700">
                <span className="text-sm sm:text-base font-medium">Subtotal</span>
                <span className="font-semibold text-sm sm:text-base">₹{subtotal.toFixed(2)}</span>
              </div>
              
              {/* GST - Commented out */}
              {/* <div className="flex justify-between text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-medium">GST (18%)</span>
                  <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50 text-xs font-semibold">
                    Tax
                  </Badge>
                </div>
                <span className="font-semibold text-sm sm:text-base">₹{gstAmount.toFixed(2)}</span>
              </div> */}
              
              <Separator className="bg-yellow-200" />
              
              {/* Total */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg sm:text-xl font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    ₹{totalAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">Inclusive of all taxes</div>
                </div>
              </div>
            </div>

            {/* ✅ NEW: Authentication notice for checkout */}
            {(!isAuthenticated || !user) && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                <p className="text-sm text-orange-800 font-medium">
                  Please login to proceed with checkout
                </p>
              </div>
            )}

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-xl text-base sm:text-lg font-bold rounded-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* ✅ NEW: Different button text based on authentication */}
              {!isAuthenticated || !user ? (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Login to Checkout
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            
            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Secure Checkout
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartWrapper;