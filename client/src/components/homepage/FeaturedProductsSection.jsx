import {
  Eye,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../../store/shop/cart-store";
import useAuthStore from "../../store/auth-slice/auth-store";
import { toast } from "sonner";

const FeaturedProductsSection = ({ products = [] }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToCart, fetchCartItems, cartItems } = useCartStore();

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  async function handleAddToCart(getProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast(`Only ${getQuantity} quantity can be added for this item`, {
            duration: 2000,
          });
          return;
        }
      }
    }

    const result = await addToCart({
      userId: user?.id,
      productId: getProductId,
      quantity: 1,
    });

    if (result?.success) {
      toast(result.message, {
        duration: 2000,
        icon: "✔",
      });
      await fetchCartItems({ userId: user?.id });
    }
  }

  async function handleBuyNow(getProductId, getTotalStock) {
    await handleAddToCart(getProductId, getTotalStock);
    navigate("/shop/address");
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No featured products available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors hidden sm:flex"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-6 overflow-x-auto px-4 sm:px-12"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitScrollbar: { display: "none" },
        }}
      >
        {products.map((item) => {
          const product = item.productId;
          if (!product) return null;

          return (
            <div
              key={item._id}
              className="flex-shrink-0 w-48 sm:w-64 bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <a href={`/shop/product/${product._id}`} className="block">
                <div className="relative overflow-hidden aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                    <button className="bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-green-50 transition-colors">
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                  </div>
                </div>
                <div className="p-2 sm:p-4 space-y-1 sm:space-y-2">
                  <h3 className="font-semibold text-xs sm:text-base text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {product.title}
                  </h3>

                  {product.description && (
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  {product.size && (
                    <p className="text-xs sm:text-sm text-gray-500">
                      {product.size}
                    </p>
                  )}
                  {/* <div className="flex items-center gap-1 sm:gap-2">
                    {product.salePrice ? (
                      <>
                        <span className="text-sm sm:text-lg font-bold text-green-600">
                          ₹{product.salePrice}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          ₹{product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm sm:text-lg font-bold text-gray-800">
                        ₹{product.price}
                      </span>
                    )}
                  </div> */}
                  <div className="flex items-center gap-1 sm:gap-2 sm:justify-between">
                    <span
                      className={`${
                        product?.salePrice > 0
                          ? "line-through text-gray-500 text-[10px] sm:text-lg"
                          : "text-yellow-600 text-xs sm:text-lg"
                      } font-semibold`}
                    >
                      ₹{product?.price}
                    </span>
                    {product?.salePrice > 0 && (
                      <span className="text-xs sm:text-xl font-bold text-yellow-600">
                        ₹{product?.salePrice}
                      </span>
                    )}
                  </div>
                  {product.averageReview > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        {product.averageReview.toFixed(1)} (
                        {product.totalReviews || 0})
                      </span>
                    </div>
                  )}
                </div>
              </a>
              <div className="p-2 sm:p-4 pt-0 space-y-2">
                <button
                  onClick={() =>
                    handleAddToCart(product._id, product.totalStock)
                  }
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleBuyNow(product._id, product.totalStock)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors hidden sm:flex"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Navigation Arrows at Bottom */}
      <div className="flex justify-center gap-4 mt-4 sm:hidden">
        <button
          onClick={scrollLeft}
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={scrollRight}
          className="bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors border border-gray-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedProductsSection;
