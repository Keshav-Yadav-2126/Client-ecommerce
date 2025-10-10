import ProductFilter from "@/components/shopping-view/Filter";
import ShoppingProjectTile from "@/components/shopping-view/Project-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import useAuthStore from "@/store/auth-slice/auth-store";
import useCartStore from "@/store/shop/cart-store";
import useShoppingStore from "@/store/shop/product-store";
import { ArrowUpDown, Filter, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const ShoppingListing = () => {
  const navigate = useNavigate();
  const { fetchAllFilteredProducts, productList, isLoading } =
    useShoppingStore();
  const { addToCart, fetchCartItems, cartItems } = useCartStore();
  const { user } = useAuthStore();
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("price-lowtohigh");
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    console.log("🚀 Listing page mounted");
    console.log("📍 Current URL params:", searchParams.toString());

    const urlFilters = {};

    // Read filters from URL
    for (const [key, value] of searchParams.entries()) {
      if (value) {
        urlFilters[key] = value.split(",");
      }
    }

    console.log("📦 URL Filters:", urlFilters);

    // If URL has filters, use them
    if (Object.keys(urlFilters).length > 0) {
      console.log("✅ Using URL filters");
      setFilters(urlFilters);
      sessionStorage.setItem("filters", JSON.stringify(urlFilters));
    } else {
      // Otherwise check sessionStorage
      const savedFilters = sessionStorage.getItem("filters");
      if (savedFilters) {
        try {
          const parsed = JSON.parse(savedFilters);
          console.log("✅ Using sessionStorage filters:", parsed);
          setFilters(parsed);

          // Update URL to match sessionStorage
          const newSearchParams = new URLSearchParams();
          for (const [key, value] of Object.entries(parsed)) {
            if (value && Array.isArray(value) && value.length > 0) {
              newSearchParams.set(key, value.join(","));
            }
          }
          setSearchParams(newSearchParams, { replace: true });
        } catch (e) {
          console.error("Error parsing saved filters:", e);
          sessionStorage.removeItem("filters");
        }
      }
    }
  }, []); // Only run once on mount

  // Fetch products when filters or sort changes
  useEffect(() => {
    console.log("🔄 Fetching products with:", { filters, sort });
    fetchAllFilteredProducts(filters, sort);
  }, [filters, sort]);

  function handleSort(value) {
    console.log("📊 Sort changed to:", value);
    setSort(value);
  }

  const handleFilter = (key, value, isChecked) => {
  setFilters((prev) => {
    const currentValues = prev[key] || [];
    const updatedValues = isChecked
      ? [...new Set([...currentValues, value])]
      : currentValues.filter((v) => v !== value);

    // Create new filters object
    const newFilters = { ...prev };
    if (updatedValues.length > 0) {
      newFilters[key] = updatedValues;
    } else {
      delete newFilters[key];
    }

    // ✅ Update URL params
    const newSearchParams = new URLSearchParams();
    for (const [paramKey, paramValues] of Object.entries(newFilters)) {
      if (Array.isArray(paramValues) && paramValues.length > 0) {
        newSearchParams.set(paramKey, paramValues.join(","));
      }
    }
    setSearchParams(newSearchParams);

    // ✅ Save filters to sessionStorage
    if (Object.keys(newFilters).length > 0) {
      sessionStorage.setItem("filters", JSON.stringify(newFilters));
    } else {
      sessionStorage.removeItem("filters");
    }

    console.log("✅ Updated Filters:", newFilters);
    return newFilters;
  });
};


  function removeFilter(sectionId, optionId) {
    console.log("❌ Removing filter:", sectionId, optionId);

    let cpyFilters = { ...filters };

    if (cpyFilters[sectionId]) {
      cpyFilters[sectionId] = cpyFilters[sectionId].filter(
        (item) => item !== optionId
      );

      if (cpyFilters[sectionId].length === 0) {
        delete cpyFilters[sectionId];
      }
    }

    setFilters(cpyFilters);

    // Update URL
    const newSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(cpyFilters)) {
      if (value && Array.isArray(value) && value.length > 0) {
        newSearchParams.set(key, value.join(","));
      }
    }
    setSearchParams(newSearchParams);

    // Update sessionStorage
    if (Object.keys(cpyFilters).length > 0) {
      sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
    } else {
      sessionStorage.removeItem("filters");
    }
  }

  function handleGetProductDetails(productId) {
    navigate(`/shop/product/${productId}`);
  }

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

  function handleClearFilters() {
    console.log("🧹 Clearing all filters");
    setFilters({});
    setSearchParams(new URLSearchParams());
    sessionStorage.removeItem("filters");
  }

  const activeFilterCount = Object.values(filters).reduce(
    (total, current) => total + current.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50">
      {/* Mobile Filter Button */}
      <div className="lg:hidden p-4">
        <Button
          onClick={() => setMobileFiltersOpen(true)}
          className="w-full flex items-center gap-2 bg-white border-yellow-300 text-yellow-600 hover:bg-yellow-50"
          variant="outline"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-yellow-500 text-white">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 p-4 md:p-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block">
          <ProductFilter filters={filters} handleFilter={handleFilter} />

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                  Active Filters
                </h3>
                <Button
                  onClick={handleClearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-2">
                {Object.entries(filters).map(([sectionId, options]) =>
                  options.map((optionId) => (
                    <div
                      key={`${sectionId}-${optionId}`}
                      className="flex items-center justify-between bg-yellow-50 px-3 py-2 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 capitalize">
                        {sectionId}: {optionId}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFilter(sectionId, optionId)}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                      >
                        <X className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Filters Sheet */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <ProductFilter filters={filters} handleFilter={handleFilter} />

              {activeFilterCount > 0 && (
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      handleClearFilters();
                      setMobileFiltersOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="bg-white/80 backdrop-blur-sm w-full rounded-2xl shadow-lg border border-yellow-200">
          <div className="p-6 border-b border-yellow-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
              <p className="text-gray-600 mt-1">
                {isLoading
                  ? "Loading..."
                  : `${productList?.length || 0} products found`}
              </p>

              {/* Active filters pills */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(filters).map(([sectionId, options]) =>
                    options.map((optionId) => (
                      <Badge
                        key={`${sectionId}-${optionId}`}
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                      >
                        <span className="capitalize">
                          {sectionId}: {optionId}
                        </span>
                        <button
                          onClick={() => removeFilter(sectionId, optionId)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="flex items-center gap-2 bg-white border-yellow-300 text-gray-700 hover:bg-yellow-50"
                    variant="outline"
                    size="sm"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <span>Sort by</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={handleSort}
                  >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        key={sortItem.id}
                        value={sortItem.id}
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-lg mb-3"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : productList && productList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productList.map((product) => (
                  <ShoppingProjectTile
                    key={product._id}
                    product={product}
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <p className="text-lg mb-2">No products found</p>
                  <p className="text-sm">
                    Try adjusting your filters or search terms
                  </p>
                  {activeFilterCount > 0 && (
                    <Button
                      onClick={handleClearFilters}
                      variant="outline"
                      className="mt-4 border-yellow-300 text-yellow-600 hover:bg-yellow-50"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingListing;
