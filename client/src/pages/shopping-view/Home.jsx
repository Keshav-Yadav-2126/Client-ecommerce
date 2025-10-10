import React, { useEffect, useState } from "react";
import HeroCarousel from "@/components/homepage/HeroCarousel";
import CategorySection from "@/components/homepage/CategorySection";
import FeaturedProductsSection from "@/components/homepage/FeaturedProductsSection";
import AboutUsSection from "@/components/homepage/AboutUsSection";
import CustomerReviewsSection from "@/components/homepage/CustomerReviewsSection";
import axios from "axios";

const ShoppingHome = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [aboutUsContent, setAboutUsContent] = useState("");
  const [customerReviews, setCustomerReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomepageData() {
      setLoading(true);
      try {
        const bannersRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/homepage/banner/get`
        );
        setCarouselImages(bannersRes.data?.data || []);

        const featuredRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/homepage/featured/get`
        );
        setFeaturedProducts(featuredRes.data?.data || []);

        const aboutRes = await axios.get(`/api/admin/homepage/about-us`);
        setAboutUsContent(aboutRes.data?.data?.about || "");

        const reviewsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/homepage/review/approved`
        );
        setCustomerReviews(reviewsRes.data?.data || []);
      } catch (err) {
        console.error("Error loading homepage:", err);
        setCarouselImages([]);
        setCategories([]);
        setFeaturedProducts([]);
        setAboutUsContent("");
        setCustomerReviews([]);
      }
      setLoading(false);
    }

    fetchHomepageData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading homepage...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50">
      <HeroCarousel images={carouselImages} />
      <CategorySection />

      {/* 🌟 Featured Products Section */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-28 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 text-center">
          Featured Products
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto mb-10 rounded-full"></div>
        <FeaturedProductsSection products={featuredProducts} />
      </section>

      <AboutUsSection about={aboutUsContent} />
      <CustomerReviewsSection reviews={customerReviews} />
    </div>
  );
};

export default ShoppingHome;
