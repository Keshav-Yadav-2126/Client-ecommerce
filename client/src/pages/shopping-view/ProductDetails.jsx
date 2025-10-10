// pages/shopping-view/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  Leaf,
  Award,
  ArrowLeft,
  Plus,
  Minus,
  Upload,
  X,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import useShoppingStore from '@/store/shop/product-store';
import useCartStore from '@/store/shop/cart-store';
import useAuthStore from '@/store/auth-slice/auth-store';
import useReviewStore from '@/store/shop/review-store';
import StarRatingComponent from '@/components/common/star-rating';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductDetails, productDetails } = useShoppingStore();
  const { addToCart, fetchCartItems, cartItems } = useCartStore();
  const { user } = useAuthStore();
  const { getReviews, addReview, reviews, checkCanReview, canReview, hasPurchased, hasReviewed, clearReviews } = useReviewStore();
  
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewImagesPreview, setReviewImagesPreview] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedReviewImage, setSelectedReviewImage] = useState(null);

  const sizeOptions = ['50ml', '100ml', '250ml', '500ml'];

  useEffect(() => {
    clearReviews();
    if (id) {
      setLoading(true);
      fetchProductDetails(id).then(() => {
        setLoading(false);
      });
    }
  }, [id, fetchProductDetails, clearReviews]);

  useEffect(() => {
    if (productDetails && user) {
      getReviews(productDetails._id);
      checkCanReview(productDetails._id, user.id || user._id);
      
      if (productDetails.size) {
        setSelectedSize(productDetails.size);
      }
    }
  }, [productDetails, user, getReviews, checkCanReview]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + reviewImages.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Each image must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImages(prev => [...prev, reader.result]);
        setReviewImagesPreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
    setReviewImagesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    let getCartItems = [];
    if (Array.isArray(cartItems)) {
      getCartItems = cartItems;
    } else if (cartItems && Array.isArray(cartItems.items)) {
      getCartItems = cartItems.items;
    }

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => {
          const itemProductId = item.productId || item.product;
          return itemProductId === productDetails._id;
        }
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + quantity > productDetails.stock) {
          toast.error(`Only ${productDetails.stock - getQuantity} more items available`);
          return;
        }
      }
    }

    const userId = user?.id || user?._id;
    const result = await addToCart({
      userId: userId,
      productId: productDetails._id,
      quantity: quantity
    });
    
    if (result?.success) {
      toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
      await fetchCartItems({ userId: userId });
    }
  };

  const handleAddReview = async () => {
    if (!user) {
      toast.error("Please login to add a review");
      return;
    }

    if (!rating || rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!reviewMsg.trim()) {
      toast.error("Please write a review message");
      return;
    }

    const userId = user?.id || user?._id;
    const userName = user?.userName || user?.name || user?.email;

    setUploadingImages(true);
    const result = await addReview({
      productId: productDetails._id,
      userId: userId,
      userName: userName,
      reviewMessage: reviewMsg,
      reviewValue: rating,
      images: reviewImages
    });

    setUploadingImages(false);

    if (result?.success) {
      setRating(0);
      setReviewMsg("");
      setReviewImages([]);
      setReviewImagesPreview([]);
      toast.success("Review submitted successfully!");
      
      await getReviews(productDetails._id);
      await checkCanReview(productDetails._id, userId);
    } else {
      toast.error(result?.message || "Failed to add review");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites!');
  };

  const averageReview = reviews && reviews.length > 0
    ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length
    : 0;

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.reviewValue] = (distribution[review.reviewValue] || 0) + 1;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4 text-sm md:text-base">The product details could not be loaded.</p>
          <Button onClick={() => navigate('/shop/listing')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-4 md:py-6 lg:py-8 max-w-7xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 md:mb-6 text-yellow-700 hover:bg-yellow-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-lg border border-yellow-200">
              <img
                src={productDetails.image}
                alt={productDetails.title}
                className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover"
              />
              {productDetails.salePrice > 0 && (
                <Badge className="absolute top-3 md:top-4 right-3 md:right-4 bg-red-100 text-red-800 border-red-200 text-xs md:text-sm">
                  Sale
                </Badge>
              )}
              {productDetails.stock < 10 && productDetails.stock > 0 && (
                <Badge className="absolute top-3 md:top-4 left-3 md:left-4 bg-orange-100 text-orange-800 border-orange-200 text-xs md:text-sm">
                  Only {productDetails.stock} left
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 text-xs md:text-sm">
                  {productDetails.category}
                </Badge>
                <Badge variant="outline" className="border-yellow-400 text-yellow-700 bg-yellow-50 text-xs md:text-sm">
                  {productDetails.brand}
                </Badge>
              </div>
              
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
                {productDetails.title}
              </h1>

              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <StarRatingComponent rating={Math.round(averageReview)} readonly />
                  <span className="text-xs md:text-sm text-gray-600 ml-2">
                    {averageReview.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 flex-wrap">
                {productDetails.salePrice > 0 ? (
                  <>
                    <span className="text-2xl md:text-3xl font-bold text-yellow-600">
                      ${productDetails.salePrice}
                    </span>
                    <span className="text-lg md:text-xl text-gray-500 line-through">
                      ${productDetails.price}
                    </span>
                    <Badge className="bg-red-100 text-red-800 text-xs md:text-sm">
                      Save ${(productDetails.price - productDetails.salePrice).toFixed(2)}
                    </Badge>
                  </>
                ) : (
                  <span className="text-2xl md:text-3xl font-bold text-yellow-600">
                    ${productDetails.price}
                  </span>
                )}
              </div>

              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">
                {productDetails.description}
              </p>

              {/* Size Selection */}
              <div className="mb-4 md:mb-6">
                <Label className="text-sm md:text-base font-semibold mb-2 md:mb-3 block">Select Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full bg-white border-yellow-300 focus:border-yellow-500">
                    <SelectValue placeholder="Choose size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <Card className="bg-white/80 border-yellow-200 shadow-lg">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <span className="font-medium text-sm md:text-base">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="h-8 w-8 border-yellow-300"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(productDetails.stock, quantity + 1))}
                        disabled={quantity >= productDetails.stock}
                        className="h-8 w-8 border-yellow-300"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600">
                    {productDetails.stock} in stock
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg text-sm md:text-base"
                    disabled={productDetails.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFavorite}
                    className={`border-yellow-300 ${isFavorite ? 'bg-red-50 text-red-600' : 'text-yellow-600'}`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button> */}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <Card className="bg-white/60 border-blue-200 text-center p-3 md:p-4">
                <Truck className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-blue-600" />
                <p className="text-xs md:text-sm font-medium">Free Shipping</p>
                <p className="text-[10px] md:text-xs text-gray-600 hidden sm:block">Orders over $50</p>
              </Card>
              <Card className="bg-white/60 border-blue-200 text-center p-3 md:p-4">
                <Shield className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-blue-600" />
                <p className="text-xs md:text-sm font-medium">Quality Assured</p>
                <p className="text-[10px] md:text-xs text-gray-600 hidden sm:block">Lab tested</p>
              </Card>
              <Card className="bg-white/60 border-blue-200 text-center p-3 md:p-4">
                <Award className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 md:mb-2 text-yellow-600" />
                <p className="text-xs md:text-sm font-medium">Premium Grade</p>
                <p className="text-[10px] md:text-xs text-gray-600 hidden sm:block">Top quality</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Product Information Accordion */}
        <div className="mt-8 md:mt-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ingredients" className="border-yellow-200 bg-white/50 rounded-lg mb-4 px-4 md:px-6">
              <AccordionTrigger className="text-base md:text-lg font-semibold text-gray-800 hover:text-yellow-700">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
                  Ingredients
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-4">
                  {productDetails.ingredients && productDetails.ingredients.length > 0 ? (
                    productDetails.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm md:text-base">{ingredient}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm md:text-base">No ingredients information available.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="benefits" className="border-yellow-200 bg-white/50 rounded-lg mb-4 px-4 md:px-6">
              <AccordionTrigger className="text-base md:text-lg font-semibold text-gray-800 hover:text-yellow-700">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  Key Benefits
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-4">
                  {productDetails.keyBenefits && productDetails.keyBenefits.length > 0 ? (
                    productDetails.keyBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <span className="text-sm md:text-base">{benefit}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-sm md:text-base">No benefits information available.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="reviews" className="border-yellow-200 bg-white/50 rounded-lg px-4 md:px-6">
              <AccordionTrigger className="text-base md:text-lg font-semibold text-gray-800 hover:text-yellow-700">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                  Reviews ({reviews.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 pt-4">
                  {/* Rating Overview */}
                  {reviews.length > 0 && (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 md:p-6 border-2 border-yellow-200 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Overall Rating */}
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="text-4xl md:text-5xl font-bold text-yellow-600 mb-2">
                            {averageReview.toFixed(1)}
                          </div>
                          <StarRatingComponent rating={Math.round(averageReview)} readonly />
                          <p className="text-sm text-gray-600 mt-2">
                            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                          </p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => (
                            <div key={stars} className="flex items-center gap-2">
                              <span className="text-xs md:text-sm font-medium w-8">{stars} ★</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
                                  style={{
                                    width: `${reviews.length > 0 ? (ratingDistribution[stars] / reviews.length) * 100 : 0}%`
                                  }}
                                />
                              </div>
                              <span className="text-xs md:text-sm text-gray-600 w-8 text-right">
                                {ratingDistribution[stars]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add Review Section */}
                  {user ? (
                    <div className="bg-gradient-to-br from-white to-yellow-50 rounded-xl p-4 md:p-6 border-2 border-yellow-200 shadow-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-yellow-600" />
                        <h4 className="text-base md:text-lg font-bold text-gray-800">Share Your Experience</h4>
                      </div>
                      
                      {!hasPurchased && (
                        <Alert className="mb-4 border-orange-300 bg-orange-50">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <AlertDescription className="text-xs md:text-sm text-orange-800">
                            You must purchase this product before writing a review.
                          </AlertDescription>
                        </Alert>
                      )}

                      {hasReviewed && (
                        <Alert className="mb-4 border-blue-300 bg-blue-50">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-xs md:text-sm text-blue-800">
                            You have already reviewed this product.
                          </AlertDescription>
                        </Alert>
                      )}

                      {canReview && (
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-yellow-200">
                            <Label className="text-sm font-semibold mb-3 block text-gray-700">
                              How would you rate this product?
                            </Label>
                            <div className="flex justify-center">
                              <StarRatingComponent
                                rating={rating}
                                handleRatingChange={setRating}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-semibold mb-2 block text-gray-700">
                              Tell us more about your experience
                            </Label>
                            <Textarea 
                              placeholder="What did you like or dislike? How did it perform? Any tips for other buyers?" 
                              value={reviewMsg}
                              onChange={(e) => setReviewMsg(e.target.value)}
                              className="bg-white border-yellow-300 focus:border-yellow-500 min-h-[120px] text-sm md:text-base resize-none"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-semibold mb-2 block text-gray-700">
                              Add Photos (Optional - Max 3)
                            </Label>
                            <div className="space-y-3">
                              {reviewImagesPreview.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                  {reviewImagesPreview.map((img, index) => (
                                    <div key={index} className="relative w-20 h-20 md:w-24 md:h-24 group">
                                      <img 
                                        src={img} 
                                        alt={`Review ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg border-2 border-yellow-300 group-hover:border-yellow-500 transition-all"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg transition-all hover:scale-110"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {reviewImagesPreview.length < 3 && (
                                <label className="flex flex-col items-center justify-center w-full h-24 md:h-28 border-2 border-dashed border-yellow-300 rounded-lg cursor-pointer hover:bg-yellow-50 hover:border-yellow-400 transition-all group">
                                  <div className="flex flex-col items-center">
                                    <Upload className="w-6 h-6 md:w-7 md:h-7 text-yellow-600 mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs md:text-sm text-gray-600 font-medium">Upload Image</span>
                                    <span className="text-[10px] md:text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</span>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          <Button
                            onClick={handleAddReview}
                            disabled={reviewMsg.trim() === "" || rating === 0 || uploadingImages}
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
                          >
                            {uploadingImages ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Star className="w-4 h-4 mr-2" />
                                Submit Review
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Alert className="border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800 text-sm md:text-base">
                        Please login to write a review and share your experience with this product.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base md:text-lg font-bold text-gray-800">Customer Reviews</h4>
                      {reviews.length > 0 && (
                        <span className="text-xs md:text-sm text-gray-600">
                          {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                        </span>
                      )}
                    </div>

                    {reviews && reviews.length > 0 ? (
                      reviews.map((reviewItem, index) => (
                        <Card key={index} className="bg-white border border-gray-200 hover:border-yellow-300 transition-all hover:shadow-md">
                          <CardContent className="p-4 md:p-5">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4">
                              {/* Avatar */}
                              <Avatar className="w-10 h-10 md:w-12 md:h-12 border-2 border-yellow-300 ring-2 ring-yellow-100 flex-shrink-0">
                                <AvatarFallback className="bg-gradient-to-br from-yellow-100 to-orange-100 text-yellow-700 font-bold text-sm md:text-base">
                                  {reviewItem?.userName?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>

                              {/* Review Content */}
                              <div className="flex-1 min-w-0">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                  <div>
                                    <h5 className="font-semibold text-gray-800 text-sm md:text-base">
                                      {reviewItem?.userName}
                                    </h5>
                                    <div className="flex items-center gap-2 mt-1">
                                      <StarRatingComponent rating={reviewItem?.reviewValue} readonly />
                                      <span className="text-xs text-gray-500">
                                        {reviewItem?.reviewValue}.0
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(reviewItem.createdAt).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}
                                  </div>
                                </div>

                                {/* Review Text */}
                                <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-3">
                                  {reviewItem.reviewMessage}
                                </p>
                                
                                {/* Review Images */}
                                {reviewItem.images && reviewItem.images.length > 0 && (
                                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                                    {reviewItem.images.map((img, imgIndex) => (
                                      <img 
                                        key={imgIndex}
                                        src={img}
                                        alt={`Review ${imgIndex + 1}`}
                                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-yellow-400 hover:scale-105 transition-all flex-shrink-0 shadow-sm"
                                        onClick={() => setSelectedReviewImage(img)}
                                      />
                                    ))}
                                  </div>
                                )}

                                {/* Review Actions */}
                                <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                                  <button className="flex items-center gap-1 text-xs md:text-sm text-gray-600 hover:text-yellow-600 transition-colors">
                                    <ThumbsUp className="w-3 h-3 md:w-4 md:h-4" />
                                    Helpful
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button className="text-xs md:text-sm text-gray-600 hover:text-yellow-600 transition-colors">
                                    Report
                                  </button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-yellow-50 rounded-xl border-2 border-dashed border-gray-300">
                        <MessageSquare className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 text-sm md:text-base font-medium mb-2">No reviews yet</p>
                        <p className="text-gray-500 text-xs md:text-sm">Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Image Modal */}
      {selectedReviewImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedReviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedReviewImage}
              alt="Review"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;  