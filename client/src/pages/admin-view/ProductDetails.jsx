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
  AlertCircle
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
  const { getReviews, addReview, reviews, checkCanReview, canReview, hasPurchased, hasReviewed } = useReviewStore();
  
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewImages, setReviewImages] = useState([]);
  const [reviewImagesPreview, setReviewImagesPreview] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const sizeOptions = ['50ml', '100ml', '250ml', '500ml'];

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductDetails(id).then(() => {
        setLoading(false);
      });
    }
  }, [id, fetchProductDetails]);

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
      toast.success(result.message || "Review submitted! It will be visible after admin approval.");
      
      // Refresh review eligibility
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product details could not be loaded.</p>
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
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 text-yellow-700 hover:bg-yellow-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-yellow-200">
              <img
                src={productDetails.image}
                alt={productDetails.title}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              {productDetails.salePrice > 0 && (
                <Badge className="absolute top-4 right-4 bg-red-100 text-red-800 border-red-200">
                  Sale
                </Badge>
              )}
              {productDetails.stock < 10 && productDetails.stock > 0 && (
                <Badge className="absolute top-4 left-4 bg-orange-100 text-orange-800 border-orange-200">
                  Only {productDetails.stock} left
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                  {productDetails.category}
                </Badge>
                <Badge variant="outline" className="border-yellow-400 text-yellow-700 bg-yellow-50">
                  {productDetails.brand}
                </Badge>
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                {productDetails.title}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <StarRatingComponent rating={Math.round(averageReview)} readonly />
                  <span className="text-sm text-gray-600 ml-2">
                    {averageReview.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                {productDetails.salePrice > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-yellow-600">
                      ${productDetails.salePrice}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${productDetails.price}
                    </span>
                    <Badge className="bg-red-100 text-red-800">
                      Save ${(productDetails.price - productDetails.salePrice).toFixed(2)}
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-yellow-600">
                    ${productDetails.price}
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {productDetails.description}
              </p>

              {/* Size Selection */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Select Size</Label>
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
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Quantity:</span>
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
                  <span className="text-sm text-gray-600">
                    {productDetails.stock} in stock
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg"
                    disabled={productDetails.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleFavorite}
                    className={`border-yellow-300 ${isFavorite ? 'bg-red-50 text-red-600' : 'text-yellow-600'}`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white/60 border-blue-200 text-center p-4">
                <Truck className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-600">Orders over $50</p>
              </Card>
              <Card className="bg-white/60 border-blue-200 text-center p-4">
                <Shield className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Quality Assured</p>
                <p className="text-xs text-gray-600">Lab tested</p>
              </Card>
              <Card className="bg-white/60 border-blue-200 text-center p-4">
                <Award className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                <p className="text-sm font-medium">Premium Grade</p>
                <p className="text-xs text-gray-600">Top quality</p>
              </Card>
            </div>
          </div>
        </div>

        {/* Product Information Accordion */}
        <div className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ingredients" className="border-yellow-200 bg-white/50 rounded-lg mb-4 px-6">
              <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:text-yellow-700">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-yellow-600" />
                  Ingredients
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {productDetails.ingredients && productDetails.ingredients.length > 0 ? (
                    productDetails.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>{ingredient}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No ingredients information available.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="benefits" className="border-yellow-200 bg-white/50 rounded-lg mb-4 px-6">
              <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:text-yellow-700">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Key Benefits
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {productDetails.keyBenefits && productDetails.keyBenefits.length > 0 ? (
                    productDetails.keyBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{benefit}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No benefits information available.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="reviews" className="border-yellow-200 bg-white/50 rounded-lg px-6">
              <AccordionTrigger className="text-lg font-semibold text-gray-800 hover:text-yellow-700">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Reviews ({reviews.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 pt-4">
                  {/* Add Review Section */}
                  {user ? (
                    <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                      <h4 className="font-semibold text-gray-800 mb-4">Write a Review</h4>
                      
                      {!hasPurchased && (
                        <Alert className="mb-4 border-orange-300 bg-orange-50">
                          <AlertCircle className="h-4 w-4 text-orange-600" />
                          <AlertDescription className="text-orange-800">
                            You must purchase this product before writing a review.
                          </AlertDescription>
                        </Alert>
                      )}

                      {hasReviewed && (
                        <Alert className="mb-4 border-blue-300 bg-blue-50">
                          <AlertCircle className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            You have already reviewed this product.
                          </AlertDescription>
                        </Alert>
                      )}

                      {canReview && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Your Rating</Label>
                            <StarRatingComponent
                              rating={rating}
                              handleRatingChange={setRating}
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Your Review</Label>
                            <Textarea 
                              placeholder="Share your experience with this product..." 
                              value={reviewMsg}
                              onChange={(e) => setReviewMsg(e.target.value)}
                              className="bg-white border-yellow-300 min-h-[100px]"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">Add Photos (Optional - Max 3)</Label>
                            <div className="space-y-3">
                              {reviewImagesPreview.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                  {reviewImagesPreview.map((img, index) => (
                                    <div key={index} className="relative w-20 h-20">
                                      <img 
                                        src={img} 
                                        alt={`Review ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg border-2 border-yellow-300"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {reviewImagesPreview.length < 3 && (
                                <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-yellow-300 rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors">
                                  <div className="flex flex-col items-center">
                                    <Upload className="w-5 h-5 text-yellow-600 mb-1" />
                                    <span className="text-xs text-gray-600">Upload Image</span>
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
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          >
                            {uploadingImages ? 'Submitting...' : 'Submit Review'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Alert className="border-yellow-300 bg-yellow-50">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        Please login to write a review.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews && reviews.length > 0 ? (
                      reviews.map((reviewItem, index) => (
                        <Card key={index} className="bg-white border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="w-10 h-10 border border-yellow-300">
                                <AvatarFallback className="bg-yellow-100 text-yellow-700">
                                  {reviewItem?.userName?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-gray-800">{reviewItem?.userName}</h5>
                                  <StarRatingComponent rating={reviewItem?.reviewValue} readonly />
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{reviewItem.reviewMessage}</p>
                                
                                {/* Review Images */}
                                {reviewItem.images && reviewItem.images.length > 0 && (
                                  <div className="flex gap-2 mt-3">
                                    {reviewItem.images.map((img, imgIndex) => (
                                      <img 
                                        key={imgIndex}
                                        src={img}
                                        alt={`Review ${imgIndex + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80"
                                        onClick={() => window.open(img, '_blank')}
                                      />
                                    ))}
                                  </div>
                                )}
                                
                                <p className="text-xs text-gray-500 mt-2">
                                  {new Date(reviewItem.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-gray-600 py-8">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;