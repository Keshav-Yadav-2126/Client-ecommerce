import React, { useEffect, useState } from "react";
import HeroCarousel from "@/components/homepage/HeroCarousel";
import CategorySection from "@/components/homepage/CategorySection";
import FeaturedProductsSection from "@/components/homepage/FeaturedProductsSection";
import AboutUsSection from "@/components/homepage/AboutUsSection";
import CustomerReviewsSection from "@/components/homepage/CustomerReviewsSection";
import VideosSection from "@/components/homepage/VideosSection";
import { Truck, X, MessageCircle } from "lucide-react";
import axios from "axios";

const ShoppingHome = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [aboutUsContent, setAboutUsContent] = useState("");
  const [customerReviews, setCustomerReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShippingBanner, setShowShippingBanner] = useState(true);
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(false);

  // ✅ WhatsApp Configuration - UPDATE THIS WITH YOUR NUMBER
  const whatsappNumber = import.meta.env.VITE_API_WHATSAPP_NUMBER; // Replace with your WhatsApp number (with country code, no + or spaces)
  const whatsappMessage = "Hello! I'm interested in your products."; // Default message

  useEffect(() => {
    async function fetchHomepageData() {
      setLoading(true);
      try {
        // Fetch banners
        const bannersRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/homepage/banner/get`
        );
        console.log("Banners response:", bannersRes.data);
        setCarouselImages(bannersRes.data?.data || []);

        // Fetch featured products
        const featuredRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/homepage/featured/get`
        );
        console.log("Featured products response:", featuredRes.data);
        setFeaturedProducts(featuredRes.data?.data || []);

        // Fetch about us
        const aboutRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/homepage/about/get`
        );
        console.log("About us response:", aboutRes.data);
        setAboutUsContent(aboutRes.data?.data?.content || "");

        // Fetch reviews
        const reviewsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/homepage/review/approved`
        );
        console.log("Reviews response:", reviewsRes.data);
        setCustomerReviews(reviewsRes.data?.data || []);
      } catch (err) {
        console.error("Error loading homepage:", err);
        if (err.response) {
          console.error("Response error:", err.response.data);
          console.error("Status:", err.response.status);
        }
        setCarouselImages([]);
        setFeaturedProducts([]);
        setAboutUsContent("");
        setCustomerReviews([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHomepageData();
  }, []);

  // ✅ WhatsApp Click Handler
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading homepage...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50">
      {/* Free Shipping Banner */}
      {showShippingBanner && (
        <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 text-white py-3 px-4 shadow-lg overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-repeat" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          <div className="relative flex items-center justify-center gap-2 sm:gap-3 text-center">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
            
            <p className="text-xs sm:text-sm md:text-base font-bold tracking-wide">
              🎉 FREE SHIPPING on orders above ₹1,500 
              <span className="hidden sm:inline ml-2">| Shop Now & Save!</span>
            </p>

            <button
              onClick={() => setShowShippingBanner(false)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 hover:bg-white/20 rounded-full p-1 transition-all duration-200"
              aria-label="Close banner"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="sm:hidden mt-1 text-center">
            <p className="text-[10px] opacity-90 animate-pulse">
              Limited time offer!
            </p>
          </div>
        </div>
      )}

      {/* ✅ WhatsApp Floating Button - Responsive for Mobile & Desktop */}
      <div className="fixed bottom-28 right-3 sm:bottom-6 sm:right-6 z-40">
        <div className="relative">
          {/* Tooltip */}
          {showWhatsAppTooltip && (
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 sm:px-3 sm:py-2 bg-gray-900 text-white text-[10px] sm:text-xs rounded-lg whitespace-nowrap shadow-lg animate-fade-in z-50">
              Chat with us
              <div className="absolute bottom-0 right-3 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
            </div>
          )}

          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppClick}
            onMouseEnter={() => setShowWhatsAppTooltip(true)}
            onMouseLeave={() => setShowWhatsAppTooltip(false)}
            className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95"
            aria-label="Contact us on WhatsApp"
          >
            {/* Ripple Effect */}
            <span className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-30 group-hover:scale-150 transition-all duration-500"></span>
            
            {/* Pulse Animation */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></span>
            
            {/* WhatsApp Icon */}
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            
            {/* Online Indicator */}
            <span className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 border-2 border-white rounded-full animate-pulse"></span>
          </button>

          {/* Mobile-friendly tap animation */}
          <style>{`
            @keyframes fade-in {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in {
              animation: fade-in 0.3s ease-out;
            }
          `}</style>
        </div>
      </div>

      {/* Hero Carousel */}
      {carouselImages.length > 0 && <HeroCarousel images={carouselImages} />}

      {/* Category Section */}
      <CategorySection />

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
              Featured Products
            </h2>
            <div className="h-1 w-20 sm:w-24 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto rounded-full"></div>
          </div>
          <FeaturedProductsSection products={featuredProducts} />
        </section>
      )}

      {/* About Us Section */}
      <AboutUsSection about={aboutUsContent} />

      {/* Videos Section */}
      <VideosSection />

      {/* Customer Reviews Section */}
      <CustomerReviewsSection reviews={customerReviews} />
    </div>
  );
};

export default ShoppingHome;