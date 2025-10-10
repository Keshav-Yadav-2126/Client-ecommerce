//Layout.jsx - Updated Shopping Layout
import React from "react";
import { Outlet } from "react-router-dom";
import ShoppingHeader from "./Header";
import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";

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
      <footer className="bg-white/80 backdrop-blur-sm border-t border-yellow-200 mt-auto">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    Pachory
                  </h3>
                  <p className="text-xs text-gray-600">Organic Nutrition</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Premium quality organic nutrition products for a healthier
                lifestyle. Sourced from nature, crafted for wellness.
              </p>

              {/* Social Media Icons */}
              <div className="pt-2">
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Follow Us
                </p>
                <div className="flex gap-3 items-center justify-center flex-wrap">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/918800000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-200 transition-all hover:scale-110 shadow-sm group"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/pachory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-200 transition-all hover:scale-110 shadow-sm group"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-pink-600 group-hover:text-pink-700" />
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://facebook.com/pachory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-all hover:scale-110 shadow-sm group"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 text-base sm:text-lg">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/shop/home"
                    className="text-gray-600 hover:text-yellow-600 transition-colors hover:pl-1 inline-block"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/shop/listing"
                    className="text-gray-600 hover:text-yellow-600 transition-colors hover:pl-1 inline-block"
                  >
                    All Products
                  </a>
                </li>
                <li>
                  <a
                    href="/shop/search"
                    className="text-gray-600 hover:text-yellow-600 transition-colors hover:pl-1 inline-block"
                  >
                    Search
                  </a>
                </li>
                <li>
                  <a
                    href="/shop/account"
                    className="text-gray-600 hover:text-yellow-600 transition-colors hover:pl-1 inline-block"
                  >
                    My Account
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-gray-600 hover:text-yellow-600 transition-colors hover:pl-1 inline-block"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 text-base sm:text-lg">
                Categories
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/shop/listing?category=ghee-oil"
                    className="text-gray-600 hover:text-yellow-600 transition-colors hover:pl-1 inline-block"
                  >
                    Ghee & Oil
                  </a>
                </li>
                <li>
                  <a
                    href="/shop/listing?category=dry-fruits"
                    className="text-gray-600 hover:text-yellow-600 transition-colors hover:pl-1 inline-block"
                  >
                    Dry Fruits
                  </a>
                </li>
                <li>
                  <a
                    href="/shop/listing?category=spices"
                    className="text-gray-600 hover:text-yellow-600 transition-colors hover:pl-1 inline-block"
                  >
                    Spices
                  </a>
                </li>
                <li>
                  <a
                    href="/shop/listing?category=sweets"
                    className="text-gray-600 hover:text-yellow-600 transition-colors hover:pl-1 inline-block"
                  >
                    Sweets
                  </a>
                </li>
                <li>
                  <a
                    href="/shop/listing?category=pulses-flour"
                    className="text-gray-600 hover:text-yellow-600 transition-colors hover:pl-1 inline-block"
                  >
                    Pulses & Flour
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 text-base sm:text-lg">
                Contact Us
              </h4>
              <div className="flex flex-col items-center justify-center space-y-3 text-sm">
                {/* Email */}
                <a
                  href="mailto:support@pachory.com"
                  className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors group"
                >
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                    <Mail className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="group-hover:underline">
                    support@pachory.com
                  </span>
                </a>

                {/* Phone */}
                <a
                  href="tel:+918800000000"
                  className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="group-hover:underline">+91 8800000000</span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/918800000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors group"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="group-hover:underline">
                    Chat on WhatsApp
                  </span>
                </a>

                {/* Business Hours */}
                <div className="flex items-center gap-2 text-gray-600 pt-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-xs font-bold">
                      🕒
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium">Mon-Sat: 9AM-8PM</p>
                    <p className="text-xs text-gray-500">Sunday: 10AM-6PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-yellow-200 mt-8 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                © {new Date().getFullYear()} Pachory Organic Nutrition. All
                rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  Terms
                </a>
                <a
                  href="/shipping"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  Shipping
                </a>
                <a
                  href="/returns"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  Returns
                </a>
              </div>
            </div>

            {/* Payment & Trust Badges */}
            <div className="mt-6 pt-6 border-t border-yellow-100">
              <div className="flex flex-wrap justify-center items-center gap-4">
                <p className="text-xs text-gray-500">We Accept:</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600 shadow-sm">
                    💳 Cards
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600 shadow-sm">
                    📱 UPI
                  </div>
                  <div className="px-3 py-1.5 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600 shadow-sm">
                    🏦 Net Banking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ShoppingLayout;
