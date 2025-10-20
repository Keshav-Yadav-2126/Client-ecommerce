import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./Header";
import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import { Sheet, SheetContent } from "../ui/sheet";
import CartWrapper from "./cart-wrapper";
import useCartStore from "@/store/shop/cart-store";

const ShoppingLayout = () => {
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItems } = useCartStore();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50">
      {/* Header with navigation */}
      <ShoppingHeader />

      {/* Main content area */}
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Bottom Navigation for Mobile */}
      <BottomNav setOpenCartSheet={setOpenCartSheet} />

      {/* Cart Sheet */}
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetContent className="sm:max-w-md px-4 bg-white">
          <CartWrapper
            setOpenCartSheet={setOpenCartSheet}
            cartItems={
              cartItems && cartItems.items && cartItems.items.length > 0
                ? cartItems.items
                : []
            }
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ShoppingLayout;
