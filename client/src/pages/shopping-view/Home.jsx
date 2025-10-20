import React, { useEffect, useState } from "react";
import HeroCarousel from "@/components/homepage/HeroCarousel";
import CategorySection from "@/components/homepage/CategorySection";
import FeaturedProductsSection from "@/components/homepage/FeaturedProductsSection";
import AboutUsSection from "@/components/homepage/AboutUsSection";
import CustomerReviewsSection from "@/components/homepage/CustomerReviewsSection";
import VideosSection from "@/components/homepage/VideosSection";
import axios from "axios";

const ShoppingHome = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [aboutUsContent, setAboutUsContent] = useState("");
  const [customerReviews, setCustomerReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Fetch about us - FIXED ENDPOINT
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
        // Log specific error details
        if (err.response) {
          console.error("Response error:", err.response.data);
          console.error("Status:", err.response.status);
        }
        // Set empty arrays to prevent undefined errors
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
      {/* Hero Carousel - Only render if we have banners */}
      {carouselImages.length > 0 && <HeroCarousel images={carouselImages} />}

      {/* Category Section */}
      <CategorySection />

      {/* Featured Products Section - Only render if we have products */}
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

      {/* About Us Section - Only render if we have content */}
      <AboutUsSection about={aboutUsContent} />

      {/* Videos Section */}
      <VideosSection />

      {/* Customer Reviews Section - Only render if we have reviews */}
      
      <CustomerReviewsSection reviews={customerReviews} />
      
    </div>
  );
};

export default ShoppingHome;