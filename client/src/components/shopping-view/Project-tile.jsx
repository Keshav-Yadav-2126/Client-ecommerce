//project-tile.jsx
import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { categoryOptionsMap } from "@/config/index";
import { ShoppingCart, Zap } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function ShoppingProjectTile({
  product,
  handleAddToCart,
  handleGetProductDetails,
}) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    if (typeof handleGetProductDetails === "function") {
      handleGetProductDetails(product._id);
    }
  };

  // New buy now handler for multi-page checkout
  const handleBuyNow = (e) => {
    e.stopPropagation();
    // Store product info in localStorage for direct purchase
    const buyNowProduct = {
      productId: product._id,
      title: product.title,
      image: product.image,
      price: product.salePrice > 0 ? product.salePrice : product.price,
      quantity: 1,
      stock: product.stock,
    };
    localStorage.setItem("buyNowProduct", JSON.stringify(buyNowProduct));
    navigate("/shop/address");
  };

  return (
    <Card className="w-full mx-auto pt-0 gap-0 bg-white/80 border border-yellow-200 hover:shadow-xl transition-all duration-300 hover:border-yellow-300 group rounded-lg overflow-hidden">
      <div onClick={handleProductClick} className="cursor-pointer">
        {/* Mobile: Horizontal Layout | Desktop: Vertical Layout */}
        <div className="flex sm:block">
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-l-lg sm:rounded-l-none sm:rounded-t-lg flex-shrink-0 w-24 sm:w-full h-24 sm:h-auto">
            <img
              src={product?.image}
              alt={product?.title}
              className="w-full h-full sm:h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Stock/Sale Badge */}
            {product?.stock === 0 ? (
              <Badge className="absolute top-1 left-1 sm:top-3 sm:left-3 bg-red-100 text-red-800 border border-red-200 text-[9px] sm:text-xs px-1 sm:px-2 py-0.5">
                <span className="sm:hidden">Out</span>
                <span className="hidden sm:inline">Out Of Stock</span>
              </Badge>
            ) : product?.stock < 10 ? (
              <Badge className="absolute top-1 left-1 sm:top-3 sm:left-3 bg-orange-100 text-orange-800 border border-orange-200 text-[9px] sm:text-xs px-1 sm:px-2 py-0.5">
                <span className="sm:hidden">{product?.stock}</span>
                <span className="hidden sm:inline">{`Only ${product?.stock} left`}</span>
              </Badge>
            ) : product?.salePrice > 0 ? (
              <Badge className="absolute top-1 left-1 sm:top-3 sm:left-3 bg-red-100 text-red-800 border border-red-200 text-[9px] sm:text-xs px-1 sm:px-2 py-0.5">
                Sale
              </Badge>
            ) : null}

            {/* Category badge - Desktop */}
            <Badge className="hidden sm:inline-flex absolute top-3 right-3 bg-blue-100 text-blue-800 border border-blue-200 text-xs px-2 py-0.5">
              {categoryOptionsMap[product?.category] || product?.category}
            </Badge>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 sm:block">
            <CardContent className="p-2 sm:p-4 bg-gradient-to-b from-white to-yellow-50/30">
              {/* Title and Category Badge - Mobile */}
              <div className="flex justify-between items-start mb-1 sm:mb-2">
                <h2 className="text-xs sm:text-lg font-bold text-gray-800 line-clamp-2 flex-1 pr-1 sm:pr-0 sm:min-h-[3.5rem]">
                  {product?.title}
                </h2>
                <Badge className="sm:hidden flex-shrink-0 bg-blue-100 text-blue-800 border border-blue-200 text-[8px] px-1 py-0.5">
                  {categoryOptionsMap[product?.category]?.split(" ")[0] ||
                    product?.category}
                </Badge>
              </div>

              {/* Description */}
              {product?.description && (
                <p className="text-[9px] sm:text-sm text-gray-600 mb-1 sm:mb-3 line-clamp-2 leading-tight sm:leading-relaxed">
                  {product?.description}
                </p>
              )}

              {/* Size Badge */}
              <div className="mb-1 sm:mb-3">
                {product?.size && (
                  <span className="text-[9px] sm:text-sm text-gray-600 bg-gray-100 px-1 py-0.5 sm:px-2 sm:py-1 rounded inline-block">
                    {product.size}
                  </span>
                )}
              </div>

              {/* Price Section */}
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

              {/* Add to Cart Button - Mobile Only */}
              {product?.stock > 0 && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product?._id, product?.stock);
                  }}
                  className="sm:hidden w-full mt-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg transition-all duration-200 text-xs py-2 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to cart</span>
                </Button>
              )}
            </CardContent>
          </div>


        </div>
      </div>

      {/* Footer with buttons - Desktop/Tablet only */}
      <CardFooter className="hidden sm:block p-4 pt-0 space-y-2">
        {product?.stock === 0 ? (
          <Button
            className="w-full bg-gray-400 cursor-not-allowed text-base py-2"
            disabled
          >
            Out Of Stock
          </Button>
        ) : (
          <>
            {/* Add to Cart Button */}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product?._id, product?.stock);
              }}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg transition-all duration-200 text-base py-2 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to cart</span>
            </Button>

            {/* Buy Now Button */}
            <Button
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transition-all duration-200 text-base py-2 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Buy Now</span>
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProjectTile;
