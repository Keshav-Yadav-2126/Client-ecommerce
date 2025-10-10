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
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-yellow-50 via-white to-orange-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded"></div>
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-yellow-400 rounded"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
            Real reviews from real customers who love our organic products
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="relative">
          {/* Navigation Buttons - Desktop */}
          {reviews.length > 3 && (
            <>
              <Button
                onClick={prevReview}
                className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-xl hover:bg-yellow-50 border-2 border-yellow-200"
                size="icon"
              >
                <ChevronLeft className="w-6 h-6 text-yellow-600" />
              </Button>
              <Button
                onClick={nextReview}
                className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-xl hover:bg-yellow-50 border-2 border-yellow-200"
                size="icon"
              >
                <ChevronRight className="w-6 h-6 text-yellow-600" />
              </Button>
            </>
          )}

          {/* Reviews Container */}
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(currentIndex, currentIndex + 3).map((review) => (
                <Card 
                  key={review._id}
                  className="bg-white border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-2xl transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    {/* Quote Icon and Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <Quote className="w-8 h-8 text-yellow-400 opacity-50" />
                      {review.productId && (
                        <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50 text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.reviewValue
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 leading-relaxed mb-4 line-clamp-4 text-sm sm:text-base">
                      {review.reviewMessage}
                    </p>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {review.images.slice(0, 3).map((img, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={img}
                            alt={`Review image ${imgIndex + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border-2 border-yellow-200 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => window.open(img, '_blank')}
                          />
                        ))}
                      </div>
                    )}

                    {/* Product Info */}
                    {review.productId && (
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg mb-4 border border-yellow-200">
                        <img
                          src={review.productId.image}
                          alt={review.productId.title}
                          className="w-10 h-10 object-cover rounded-lg"
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

                    {/* User Info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <Avatar className="w-10 h-10 border-2 border-yellow-300">
                        <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold">
                          {review.userName?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation Dots - Mobile */}
          {reviews.length > 3 && (
            <div className="flex justify-center gap-2 mt-8 lg:hidden">
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

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Join thousands of happy customers
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {reviews.length}+ verified reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviewsSection;