// src/components/shopping-view/HomepageReviews.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const CustomerReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // const getReviews = async () => {
    //   try {
    //   const reviews = await axios.get(
    //     `${import.meta.env.VITE_API_URL}/api/shop/review/admin/all`
    //   );
    //   console.log("review loaded : ",reviews);
    //   if (reviews.data.success) {
    //     setReviews(reviews.data.data);
    //   }
    // } catch (error) {
    //   setLoading(false);
    //   console.error('Error fetching reviews:', error);
    // }
    // };
    // getReviews();
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/review/get/all`
      );
      console.log('Fetched reviews:', response.data);
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(reviews.length - 2, 1));
  };

  const prevReview = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(reviews.length - 3, 0) : prev - 1
    );
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-yellow-50 via-white to-orange-50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 lg:py-20 bg-gradient-to-br from-yellow-50 via-white to-orange-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-2 sm:mb-4">
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"></div>
            <Star className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-orange-500 to-yellow-400 rounded"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Real reviews from real customers who love our organic products
          </p>
        </div>

        <div className="relative">
          {reviews.length > 3 && (
            <>
              <button
                onClick={prevReview}
                className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-xl hover:bg-yellow-50 border-2 border-yellow-200 items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-yellow-600" />
              </button>
              <button
                onClick={nextReview}
                className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-xl hover:bg-yellow-50 border-2 border-yellow-200 items-center justify-center"
              >
                <ChevronRight className="w-6 h-6 text-yellow-600" />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {reviews.slice(currentIndex, currentIndex + 3).map((review) => (
                <div 
                  key={review._id}
                  className="bg-white border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-2xl transition-all duration-300 group rounded-lg sm:rounded-xl p-3 sm:p-6"
                >
                  <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <Quote className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-400 opacity-50" />
                    {review.productId && (
                      <span className="border border-orange-300 text-orange-700 bg-orange-50 text-xs px-2 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mb-2 sm:mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 sm:w-5 sm:h-5 ${
                          i < review.reviewValue
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-2 sm:mb-4 line-clamp-4">
                    {review.reviewMessage}
                  </p>

                  {review.productId && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg mb-2 sm:mb-4 border border-yellow-200">
                      <img
                        src={review.productId.image}
                        alt={review.productId.title}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {review.productId.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {review.productId.category}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 sm:gap-3 pt-2 sm:pt-4 border-t border-gray-100">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-yellow-300 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold flex items-center justify-center text-xs sm:text-sm">
                      {review.userName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                        {review.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 3 && (
            <div className="flex justify-center gap-2 mt-4 sm:mt-8 lg:hidden">
              {Array.from({ length: Math.ceil((reviews.length - 2) / 3) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index * 3)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    Math.floor(currentIndex / 3) === index
                      ? 'bg-yellow-500 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to review page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-6 sm:mt-12">
          <p className="text-xs sm:text-base text-gray-600 mb-2 sm:mb-4">
            Join thousands of happy customers
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              {reviews.length}+ verified reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;