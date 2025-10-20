import React from "react";
import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import useAuthStore from "@/store/auth-slice/auth-store";
import useCartStore from "@/store/shop/cart-store";
import { toast } from "sonner";
import useShoppingStore from "@/store/shop/product-store";
import { Card } from "../ui/card";

const CartItemContent = ({ cartItem, handleUpdateQuantity: customHandleUpdateQuantity, handleDeleteItem: customHandleDeleteItem }) => {
  const { user } = useAuthStore();
  const { deleteCartItem, updateCartQty } = useCartStore();
  const { productList } = useShoppingStore();

  async function handleCartItemDelete(e, getCartItem) {
    e.stopPropagation();
    e.preventDefault();

    if (customHandleDeleteItem) {
      // Use custom delete handler if provided (for buy now flow)
      customHandleDeleteItem(getCartItem.productId || getCartItem._id);
      return;
    }

    if (!user || !user.id) {
      toast.error("Please login to continue");
      return;
    }

    const productId = getCartItem?.product || getCartItem?.productId;

    if (!productId) {
      toast.error("Invalid product");
      return;
    }

    const data = await deleteCartItem({
      userId: user.id,
      productId: productId,
    });

    if (data?.success) {
      toast.success("Item removed from cart");
    } else {
      toast.error("Failed to remove item");
    }
  }

  async function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (customHandleUpdateQuantity) {
      // Use custom update handler if provided (for buy now flow)
      const productId = getCartItem.productId || getCartItem._id;
      const newQuantity = typeOfAction === "plus"
        ? getCartItem.quantity + 1
        : getCartItem.quantity - 1;

      if (newQuantity < 1) {
        toast.warning("Minimum quantity is 1");
        return;
      }

      customHandleUpdateQuantity(productId, newQuantity);
      return;
    }

    if (!user || !user.id) {
      toast.error("Please login to continue");
      return;
    }

    const productId = getCartItem?.product || getCartItem?.productId;

    if (!productId) {
      toast.error("Invalid product");
      return;
    }

    if (typeOfAction === "plus") {
      const currentProduct = productList.find(
        (product) => product._id === productId
      );

      if (currentProduct) {
        const currentStock = currentProduct.stock;

        if (getCartItem.quantity + 1 > currentStock) {
          toast.warning(`Only ${currentStock} items available in stock`);
          return;
        }
      }
    }

    const newQuantity = typeOfAction === "plus"
      ? getCartItem.quantity + 1
      : getCartItem.quantity - 1;

    if (newQuantity < 1) {
      toast.warning("Minimum quantity is 1");
      return;
    }

    try {
      const data = await updateCartQty({
        userId: user.id,
        productId: productId,
        quantity: newQuantity,
      });

      if (data?.success) {
        toast.success(
          typeOfAction === "plus" ? "Quantity increased" : "Quantity decreased",
          { duration: 1000 }
        );
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update quantity");
    }
  }

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border-yellow-200 hover:shadow-lg hover:border-yellow-300 transition-all duration-300">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
          <img
            src={cartItem?.image || '/api/placeholder/80/80'}
            alt={cartItem?.title}
            className="w-full h-full rounded-lg object-cover border-2 border-yellow-200 shadow-md"
            onError={(e) => {
              e.target.src = '/api/placeholder/80/80';
            }}
          />
        </div>
        
        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate mb-3 text-sm sm:text-base">
            {cartItem?.title}
          </h3>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-yellow-300 bg-white hover:bg-yellow-50 hover:border-yellow-400 text-yellow-600 transition-all duration-200 shadow-sm"
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
              disabled={cartItem.quantity === 1}
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
            
            <span className="font-bold text-gray-800 w-8 sm:w-10 text-center bg-yellow-50 rounded-lg py-1 text-sm sm:text-base">
              {cartItem?.quantity}
            </span>
            
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-yellow-300 bg-white hover:bg-yellow-50 hover:border-yellow-400 text-yellow-600 transition-all duration-200 shadow-sm"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
          
          {/* Price and Delete */}
          <div className="flex items-center justify-between">
            <div>
              {cartItem?.salePrice > 0 ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-green-600 text-base sm:text-lg">
                    ₹{(cartItem.salePrice * cartItem.quantity).toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500 line-through">
                    ₹{(cartItem.price * cartItem.quantity).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="font-bold text-gray-800 text-base sm:text-lg">
                  ₹{(cartItem.price * cartItem.quantity).toFixed(2)}
                </span>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleCartItemDelete(e, cartItem)}
              className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItemContent;