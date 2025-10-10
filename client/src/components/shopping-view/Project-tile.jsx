//project-tile.jsx
import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { categoryOptionsMap } from '@/config/index';
// import { useNavigate } from 'react-router-dom';

function ShoppingProjectTile({ product, handleAddToCart, handleGetProductDetails }) {
  const handleProductClick = () => {
    if (typeof handleGetProductDetails === "function") {
      handleGetProductDetails(product._id);
    }
  };

  return (
  <Card className="w-full max-w-md mx-auto pt-0 gap-0 bg-white/80 border-yellow-200 hover:shadow-xl transition-all duration-300 hover:border-yellow-300 group">
      <div onClick={handleProductClick} className="cursor-pointer">
        <div className='relative overflow-hidden rounded-t-lg'>
          <img 
            src={product?.image} 
            alt={product?.title} 
            className='w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105'
          />
          {product?.stock === 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-100 text-red-800 border-red-200">
              Out Of Stock
            </Badge>
          ) : product?.stock < 10 ? (
            <Badge className="absolute top-3 left-3 bg-orange-100 text-orange-800 border-orange-200">
              {`Only ${product?.stock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-red-100 text-red-800 border-red-200">
              Sale
            </Badge>
          ) : null}
          
          {/* Category badge */}
          <Badge className="absolute top-3 right-3 bg-blue-100 text-blue-800 border-blue-200">
            {categoryOptionsMap[product?.category] || product?.category}
          </Badge>
        </div>
        <CardContent className="p-4 bg-gradient-to-b from-white to-yellow-50/30">
          <h2 className='text-lg font-bold mb-2 text-gray-800 line-clamp-2 min-h-[3.5rem]'>
            {product?.title}
          </h2>
          <div className='flex justify-between items-center mb-3'>
            {/* Brand badge removed as per new requirements */}
            {product?.size && (
              <span className='text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded'>
                {product.size}
              </span>
            )}
          </div>
          <div className='flex justify-between items-center mb-2'>
            <span 
              className={`${
                product?.salePrice > 0 ? "line-through text-gray-500" : "text-yellow-600"
              } text-lg font-semibold`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className='text-xl font-bold text-yellow-600'>
                ${product?.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-4 pt-0">
        {product?.stock === 0 ? (
          <Button className="w-full bg-gray-400 cursor-not-allowed" disabled>
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation when clicking add to cart
              handleAddToCart(product?._id, product?.stock);
            }}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg transition-all duration-200"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default ShoppingProjectTile;