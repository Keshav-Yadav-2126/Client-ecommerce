//Header.jsx
import {
  House,
  LogOut,
  Menu,
  ShoppingCart,
  User,
  Pill,
  Apple,
  Dumbbell,
  Leaf,
  Droplets,
  Search,
} from "lucide-react";
import React, { useEffect, useState, useRef, useCallback } from "react";
// import pachoryLogo from "@/assets/pachory-logo.png";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import useAuthStore from "@/store/auth-slice/auth-store";
import { shoppingViewHeaderMenuItems } from "@/config/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import CartWrapper from "./cart-wrapper";
import useCartStore from "@/store/shop/cart-store";
import { Label } from "../ui/label";

// Icon mapping for menu items
const menuIcons = {
  home: House,
  supplements: Pill,
  vitamins: Apple,
  protein: Dumbbell,
  herbs: Leaf,
  oils: Droplets,
  search: Search,
};

const ShoppingHeader = () => {
  const { isAuthenticated, user, logoutUser } = useAuthStore();
  const navigate = useNavigate();
  const { cartItems, fetchCartItems, clearCart } = useCartStore();
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasFetchedCart = useRef(false);
  const isUpdatingCart = useRef(false);

  // const pachoryLogo = "/assets/pachory-logo.png";

  const handleOpenCartSheet = useCallback((value) => {
    if (isUpdatingCart.current) return;
    setOpenCartSheet(value);
  }, []);

  function handleLogout() {
    clearCart();
    logoutUser();
    navigate("/auth/login", { replace: true });
  }

  // Header.jsx - MenuItems function fix
  // Header.jsx - Replace the MenuItems function with this fixed version

  function MenuItems() {
    function handleNavigate(getCurrentMenuItem) {
      setMobileMenuOpen(false); // Close mobile menu

      // Check if it's a category (not home or search)
      const isCategory =
        getCurrentMenuItem.id !== "home" && getCurrentMenuItem.id !== "search";

      if (isCategory) {
        // For categories: Set filter and navigate with category param
        const filterData = {
          category: [getCurrentMenuItem.id],
        };

        sessionStorage.setItem("filters", JSON.stringify(filterData));

        // Navigate to listing with category in URL
        navigate(`/shop/listing?category=${getCurrentMenuItem.id}`, {
          replace: false,
        });
      } else if (getCurrentMenuItem.id === "home") {
        // For home: Clear everything
        sessionStorage.removeItem("filters");
        navigate("/shop/home");
      } else if (getCurrentMenuItem.id === "search") {
        // For search: Clear filters
        sessionStorage.removeItem("filters");
        navigate("/shop/search");
      }
    }

    return (
      <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
        {shoppingViewHeaderMenuItems.map((menuItem) => {
          const IconComponent = menuIcons[menuItem.id];

          // Check if current menu item is active
          const isActive =
            location.pathname === menuItem.path &&
            (menuItem.id === "home" ||
              menuItem.id === "search" ||
              searchParams.get("category") === menuItem.id);

          return (
            <div
              key={menuItem.id}
              onClick={() => handleNavigate(menuItem)}
              className={`flex items-center gap-2 cursor-pointer group ${
                isActive ? "text-yellow-600" : "text-gray-700"
              }`}
            >
              {IconComponent && (
                <IconComponent
                  className={`w-4 h-4 transition-colors duration-200 ${
                    isActive
                      ? "text-yellow-600"
                      : "text-yellow-600 group-hover:text-yellow-700"
                  }`}
                />
              )}
              <Label
                className={`text-sm font-medium cursor-pointer transition-colors duration-200 ${
                  isActive
                    ? "text-yellow-600 font-bold"
                    : "group-hover:text-yellow-600"
                }`}
              >
                {menuItem.label}
              </Label>
            </div>
          );
        })}
      </nav>
    );
  }

  useEffect(() => {
    if (user && (user._id || user.id) && !hasFetchedCart.current) {
      const id = user._id || user.id;
      fetchCartItems({ userId: id });
      hasFetchedCart.current = true;
    }

    if (!user) {
      hasFetchedCart.current = false;
    }
  }, [user?.id, user?._id]);

  function HeaderRightContent() {
    return (
      <div className="flex lg:items-center lg:flex-row flex-col gap-4">
        {/* Cart Button and Sheet */}
        <div>
          <Button
            onClick={() => handleOpenCartSheet(true)}
            variant="outline"
            size="icon"
            className="relative border-yellow-300 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-200"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItems?.items?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md animate-pulse">
                {cartItems.items.length}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </Button>
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-gradient-to-r from-yellow-500 to-yellow-600 cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <AvatarFallback className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-extrabold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            className="w-56 bg-white border-yellow-200"
          >
            <DropdownMenuLabel className="text-gray-800">
              Logged in as {user?.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-yellow-200" />
            <DropdownMenuItem
              onClick={() => navigate("/shop/account")}
              className="text-gray-700 hover:bg-yellow-50 cursor-pointer"
            >
              <User className="mr-2 h-4 w-4 text-yellow-600" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-yellow-200" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-gray-700 hover:bg-yellow-50 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4 text-red-600" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-sm border-yellow-200 shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link
            to="/shop/home"
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            {/* <img
              src= {pachoryLogo} // ✅ place your logo in public/assets/logo.png
              alt="Pachory Logo"
              className="h-10 w-auto rounded-lg shadow-md border border-yellow-200 p-1 bg-white"
            /> */}
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                Pachory
              </span>
              <p className="text-xs text-gray-600">Organic Nutrition</p>
            </div>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden border-yellow-300 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-400 transition-all duration-200"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs bg-white">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                    <House className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      Pachory
                    </span>
                    <p className="text-xs text-gray-600">Organic Nutrition</p>
                  </div>
                </div>
              </div>
              <MenuItems />
              <div className="mt-6 pt-6 border-t border-yellow-200">
                <HeaderRightContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Menu */}
          <div className="hidden lg:block">
            <MenuItems />
          </div>

          {/* Desktop Right Content */}
          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        </div>
      </header>

      {/* Cart Sheet */}
      <Sheet open={openCartSheet} onOpenChange={handleOpenCartSheet}>
        <SheetContent className="sm:max-w-md px-4 bg-white">
          <CartWrapper
            setOpenCartSheet={handleOpenCartSheet}
            cartItems={
              cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items
                : []
            }
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ShoppingHeader;
