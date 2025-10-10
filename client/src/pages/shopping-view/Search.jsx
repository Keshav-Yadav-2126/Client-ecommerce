import useShoppingStore from "@/store/shop/product-store";
import useSearchStore from "@/store/shop/search-store";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
// import ProductDetailsDialog from "@/components/shopping-view/Product-detail";
import { Input } from "@/components/ui/input";
import ShoppingProjectTile from "../../components/shopping-view/Project-tile";
import useCartStore from "@/store/shop/cart-store";
import { toast } from "sonner";
import useAuthStore from "@/store/auth-slice/auth-store";
import { Search, X, TrendingUp, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductDetails from "./ProductDetails";

const SearchProducts = () => {
  const [keyword, setKeyword] = useState("");
  const { getSearchResults, resetSearchResults, searchResults, isLoading } =
    useSearchStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const navigate = useNavigate();
  const { productDetails, fetchProductDetails } = useShoppingStore();
  const { cartItems, addToCart, fetchCartItems } = useCartStore();
  const { user } = useAuthStore();
  const [recentSearches, setRecentSearches] = useState([]);

  // Popular search terms
  const popularSearches = [
    "Vitamins",
    "Protein",
    "Supplements",
    "Herbs",
    "Essential Oils",
    "Organic",
  ];

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = [];
    if (Array.isArray(cartItems)) {
      getCartItems = cartItems;
    } else if (cartItems && Array.isArray(cartItems.items)) {
      getCartItems = cartItems.items;
    }

    const userId = user.id || user._id;

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex((item) => {
        const itemProductId = item.productId || item.product;
        return itemProductId === getCurrentProductId;
      });
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this item`
          );
          return;
        }
      }
    }

    addToCart({
      userId: userId,
      productId: getCurrentProductId,
      quantity: 1,
    }).then((data) => {
      if (data?.success) {
        fetchCartItems({ userId: userId });
        toast.success("Product added to cart");
      } else {
        toast.error("Failed to add product to cart");
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`);
  }

  function handleClearSearch() {
    setKeyword("");
    resetSearchResults();
    setSearchParams(new URLSearchParams());
  }

  function handlePopularSearch(term) {
    setKeyword(term);
    // Save to recent searches
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  }

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      const timer = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        getSearchResults(keyword);
        // Save to recent searches
        const updated = [
          keyword,
          ...recentSearches.filter((s) => s !== keyword),
        ].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setSearchParams(new URLSearchParams());
      resetSearchResults();
    }
  }, [keyword]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    if (user && (user.id || user._id)) {
      const userId = user.id || user._id;
      fetchCartItems({ userId: userId });
    }
  }, [user, fetchCartItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-cream-50">
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Search Header */}
        <div className="max-w-4xl mx-auto mb-12">
          {/* <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-3">
              Search Products
            </h1>
            <p className="text-gray-600 text-lg">
              Find your perfect organic nutrition products
            </p>
          </div> */}

          {/* Search Input */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-400 pointer-events-none" />
              <Input
                value={keyword}
                name="keyword"
                onChange={(event) => setKeyword(event.target.value)}
                className="w-full pl-12 pr-12 py-6 text-lg bg-white border-2 border-yellow-200 focus:border-yellow-400 rounded-2xl shadow-lg transition-all duration-200"
                placeholder="Search by product name, description, category..."
              />
              {keyword && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSearch}
                  className="absolute right-2 h-10 w-10 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </Button>
              )}
            </div>

            {/* Search hint */}
            {!keyword && (
              <p className="text-sm text-gray-500 mt-2 ml-2">
                Start typing to search (minimum 3 characters)
              </p>
            )}
          </div>

          {/* Popular & Recent Searches */}
          {!keyword && (
            <div className="mt-8 space-y-6">
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold text-gray-800">
                    Popular Searches
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <Badge
                      key={term}
                      variant="outline"
                      className="cursor-pointer border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-400 transition-all duration-200 px-4 py-2 text-sm"
                      onClick={() => handlePopularSearch(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">
                      Recent Searches
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 px-4 py-2 text-sm"
                        onClick={() => setKeyword(term)}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mb-4" />
            <p className="text-gray-600 text-lg">Searching for products...</p>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && keyword && keyword.trim().length > 2 && (
          <div>
            {searchResults.length > 0 ? (
              <div>
                {/* Results Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200 p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Search Results
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Found {searchResults.length}{" "}
                        {searchResults.length === 1 ? "product" : "products"}{" "}
                        matching "{keyword}"
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-lg">
                      {searchResults.length}
                    </Badge>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {searchResults.map((item) => (
                    <ShoppingProjectTile
                      key={item._id}
                      handleAddToCart={handleAddToCart}
                      product={item}
                      handleGetProductDetails={handleGetProductDetails}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200 p-12">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full mb-4">
                      <Search className="h-10 w-10 text-yellow-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                    No Products Found
                  </h2>
                  <p className="text-gray-600 text-lg mb-6">
                    We couldn't find any products matching "{keyword}"
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>
                      Try searching with different keywords or check these
                      suggestions:
                    </p>
                    <ul className="space-y-1">
                      <li>• Check your spelling</li>
                      <li>• Use more general terms</li>
                      <li>• Try different category names</li>
                    </ul>
                  </div>
                  <Button
                    onClick={handleClearSearch}
                    variant="outline"
                    className="mt-6 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  >
                    Clear Search
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State - When no search */}
        {!isLoading && !keyword && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-yellow-200 p-12 mt-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full mb-4">
                  <Search className="h-12 w-12 text-yellow-600" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                Start Your Search
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                Search through our wide collection of organic nutrition products
              </p>
              <p className="text-sm text-gray-500">
                You can search by product name, description, category, or brand
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ProductDetails is now handled by route navigation */}
    </div>
  );
};

export default SearchProducts;
