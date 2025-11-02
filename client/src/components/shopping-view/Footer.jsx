import { Facebook, Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import React, { useState } from "react";

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-yellow-200 mt-auto">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        {/* Mobile: Accordion Layout | Desktop: Grid Layout */}
        <div className="block sm:hidden space-y-3">
          {/* Company Info - Always Visible on Mobile */}
          <div className="space-y-3 pb-4 border-b border-yellow-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold">P</span>
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Pachory
                </h3>
                <p className="text-xs text-gray-600">Organic Nutrition</p>
              </div>
            </div>

            {/* Social Media - Compact */}
            <div className="flex gap-2 justify-center">
              <a
                href="https://wa.me/918800000000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
              </a>
              <a
                href="https://instagram.com/pachory"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-all"
              >
                <Instagram className="w-4 h-4 text-pink-600" />
              </a>
              <a
                href="https://facebook.com/pachory"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-all"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
              </a>
            </div>
          </div>

          {/* Quick Links Accordion */}
          <div className="border-b border-yellow-100">
            <button
              onClick={() => toggleSection("links")}
              className="w-full flex justify-between items-center py-3 text-sm font-semibold text-gray-800"
            >
              Quick Links
              <span className="text-yellow-600">
                {expandedSection === "links" ? "−" : "+"}
              </span>
            </button>
            {expandedSection === "links" && (
              <ul className="space-y-2 pb-3 text-sm">
                <li>
                  <a
                    href="/shop/home"
                    className="text-gray-600 hover:text-yellow-600"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/shop/listing"
                    className="text-gray-600 hover:text-yellow-600"
                  >
                    All Products
                  </a>
                </li>
                <li>
                  <a
                    href="/shop/account"
                    className="text-gray-600 hover:text-yellow-600"
                  >
                    My Account
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* Categories Accordion */}
          <div className="border-b border-yellow-100">
            <button
              onClick={() => toggleSection("categories")}
              className="w-full flex justify-between items-center py-3 text-sm font-semibold text-gray-800"
            >
              Categories
              <span className="text-yellow-600">
                {expandedSection === "categories" ? "−" : "+"}
              </span>
            </button>
            {expandedSection === "categories" && (
              <ul className="space-y-2 pb-3 text-sm">
                <li>
                  <a
                    href="/shop/listing?category=ghee-oil"
                    className="text-gray-600 hover:text-yellow-600"
                  >
                    Ghee & Oil
                  </a>
                </li>
                <li>
                  <a
                    href="/shop/listing?category=dry-fruits"
                    className="text-gray-600 hover:text-yellow-600"
                  >
                    Dry Fruits
                  </a>
                </li>
                <li>
                  <a
                    href="/shop/listing?category=spices"
                    className="text-gray-600 hover:text-yellow-600"
                  >
                    Spices
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* Contact - Compact */}
          <div className="pt-3 space-y-2">
            <h4 className="text-sm font-semibold text-gray-800 text-center mb-3">
              Contact Us
            </h4>
            <div className="flex justify-center gap-4 text-xs">
              <a
                href="tel:+918800000000"
                className="flex items-center gap-1 text-gray-600"
              >
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </a>
              <a
                href="mailto:support@pachory.com"
                className="flex items-center gap-1 text-gray-600"
              >
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </a>
              <a
                href="https://wa.me/918800000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-600"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Desktop: Original Grid Layout */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
              lifestyle.
            </p>
            <div className="pt-2">
              <p className="text-sm font-semibold text-gray-800 mb-3">
                Follow Us
              </p>
              <div className="flex gap-3 justify-center">
                <a
                  href="https://wa.me/918003245515"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-all hover:scale-110 shadow-sm"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </a>
                <a
                  href="https://www.instagram.com/pachoryfarm?igsh=eWI3dGJ1YmZlYTJ3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-all hover:scale-110 shadow-sm"
                >
                  <Instagram className="w-5 h-5 text-pink-600" />
                </a>
                <a
                  href="https://www.facebook.com/share/1BaccYxKVi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-all hover:scale-110 shadow-sm"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/shop/home"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/shop/listing"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  All Products
                </a>
              </li>
              <li>
                <a
                  href="/shop/search"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  Search
                </a>
              </li>
              <li>
                <a
                  href="/shop/account"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  My Account
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 text-lg">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/shop/listing?category=ghee-oil"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  Ghee & Oil
                </a>
              </li>
              <li>
                <a
                  href="/shop/listing?category=dry-fruits"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  Dry Fruits
                </a>
              </li>
              <li>
                <a
                  href="/shop/listing?category=spices"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  Spices
                </a>
              </li>
              <li>
                <a
                  href="/shop/listing?category=sweets"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  Sweets
                </a>
              </li>
              <li>
                <a
                  href="/shop/listing?category=pulses-flour"
                  className="text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  Pulses & Flour
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 text-lg">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:support@pachory.com"
                className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{import.meta.env.VITE_API_EMAIL}</span>
              </a>
              <a
                href="tel:+918003245515"
                className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+91{import.meta.env.VITE_API_WHATSAPP_NUMBER}</span>
              </a>
              <a
                href="https://wa.me/8003245515"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Simplified for Mobile */}
        <div className="border-t border-yellow-200 mt-6 sm:mt-8 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600 text-center">
              © {new Date().getFullYear()} Pachory. All rights reserved.
            </p>
            <div className="flex gap-3 sm:gap-6 text-xs">
              <a
                href="/privacy"
                className="text-gray-600 hover:text-yellow-600"
              >
                Privacy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-yellow-600">
                Terms
              </a>
              <a
                href="/shipping"
                className="text-gray-600 hover:text-yellow-600"
              >
                Shipping
              </a>
            </div>
          </div>

          {/* Payment Badges - Compact for Mobile */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-yellow-100">
            <div className="flex flex-wrap justify-center items-center gap-2">
              <p className="text-xs text-gray-500">We Accept:</p>
              <div className="flex gap-1.5">
                <div className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                  💳 Cards
                </div>
                <div className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                  📱 UPI
                </div>
                <div className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
                  🏦 Banking
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
