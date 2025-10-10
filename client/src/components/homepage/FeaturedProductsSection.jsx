import { Eye, Heart, ShoppingBag } from "lucide-react";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((item) => {
        const product = item.productId;
        if (!product) return null;

        return (
          <a
            key={item._id}
            href={`/shop/product/${product._id}`}
            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2"
          >
            <div className="relative overflow-hidden aspect-square bg-gray-100">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* {product.salePrice && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                </div>
              )} */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                {/* <button className="bg-white rounded-full p-2 shadow-lg hover:bg-green-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-700" />
                </button> */}
                <button className="bg-white rounded-full p-2 shadow-lg hover:bg-green-50 transition-colors">
                  <Eye className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
                {product.title}
              </h3>
              <div className="flex items-center gap-2">
                {product.salePrice ? (
                  <>
                    <span className="text-lg font-bold text-green-600">
                      ₹{product.salePrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-800">
                    ₹{product.price}
                  </span>
                )}
              </div>
              {product.averageReview > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
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