import { Eye } from "lucide-react";

const FeaturedProductsSection = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No featured products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      {products.map((item) => {
        const product = item.productId;
        if (!product) return null;

        return (
          <a
            key={item._id}
            href={`/shop/product/${product._id}`}
            className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2"
          >
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
              <div className="flex items-center gap-1 sm:gap-2">
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
              </div>
              {product.averageReview > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs sm:text-sm text-gray-600">
                    {product.averageReview.toFixed(1)} ({product.totalReviews || 0})
                  </span>
                </div>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default FeaturedProductsSection;