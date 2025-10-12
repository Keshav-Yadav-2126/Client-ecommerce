//Layout.jsx - Updated Shopping Layout
import React from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./Header";
import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import Footer from "./Footer";

const ShoppingLayout = () => {
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
    </div>
  );
};

export default ShoppingLayout;
