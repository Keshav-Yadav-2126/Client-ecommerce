// AdminFeatures.jsx - UPDATED with Approve/Reject functionality
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Image,
  Star,
  Package,
  Tag,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  EyeOff,
  Eye,
  Video,
  X,
} from "lucide-react";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAdminProductsStore from "@/store/admin/product-store";

const AdminFeatures = () => {
  const [activeTab, setActiveTab] = useState("banners");
  const [banners, setBanners] = useState([]);
  const [discountBanner, setDiscountBanner] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState("");
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);

  const { productList, fetchAllProduct } = useAdminProductsStore();

  // Banner form state
  const [bannerForm, setBannerForm] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    buttonText: "",
    order: 0,
  });

  // Discount banner form
  const [discountForm, setDiscountForm] = useState({
    text: "",
    discountPercentage: "",
    backgroundColor: "#F59E0B",
    textColor: "#FFFFFF",
  });

  // Video form state
  const [videoForm, setVideoForm] = useState({
    videoFile: null,
    thumbnailFile: null,
    order: 0,
  });

  // File size constants - NEW
  const maxVideoSize = 100 * 1024 * 1024; // 100MB
  const maxThumbnailSize = 5 * 1024 * 1024; // 5M

  useEffect(() => {
    fetchAllProduct();
    fetchBanners();
    fetchDiscountBanner();
    fetchFeaturedProducts();
    fetchReviews();
    fetchVideos();
  }, []);

  // Fetch functions
  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/banner/get`
      );
      if (response.data.success) {
        setBanners(response.data.data);
      }
    } catch (error) {
      console.error("Fetch banners error:", error);
    }
  };

  const fetchDiscountBanner = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/discount/get`
      );
      if (response.data.success) {
        setDiscountBanner(response.data.data);
      }
    } catch (error) {
      console.error("Fetch discount banner error:", error);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/featured/get`
      );
      if (response.data.success) {
        setFeaturedProducts(response.data.data);
      }
    } catch (error) {
      console.error("Fetch featured products error:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      // CHANGED: Use the shop review admin endpoint instead of homepage
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/review/admin/all`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setReviews(response.data.data);
        console.log("Reviews fetched:", response.data.data); // Debug log
      }
    } catch (error) {
      console.error("Fetch reviews error:", error);
      toast.error("Failed to fetch reviews");
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/videos/get`
      );
      if (response.data.success) {
        setVideos(response.data.data);
      }
    } catch (error) {
      console.error("Fetch videos error:", error);
    }
  };

  // Banner CRUD
  const handleAddBanner = async () => {
    try {
      setIsLoading(true);

      let imageUrl = bannerForm.image; // Keep existing URL if provided

      // If user uploaded an image, upload it to Cloudinary first
      if (bannerImageFile) {
        setUploadingBannerImage(true);
        console.log("Uploading banner image to Cloudinary...");

        const imageFormData = new FormData();
        imageFormData.append("file", bannerImageFile);
        imageFormData.append(
          "upload_preset",
          import.meta.env.VITE_API_CLOUDINARY_UPLOAD_PRESET
        );

        const imageResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_API_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          imageFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              console.log(`Banner image upload: ${percentCompleted}%`);
            },
          }
        );

        if (!imageResponse.data.secure_url) {
          throw new Error("Image upload failed - no URL returned");
        }

        imageUrl = imageResponse.data.secure_url;
        console.log("✅ Banner image uploaded:", imageUrl);
        setUploadingBannerImage(false);
      }

      // Validate required fields before sending
      if (!imageUrl) {
        toast.error("Image is required");
        return;
      }

      // Prepare payload with all fields
      const payload = {
        title: bannerForm.title || "",
        description: bannerForm.description || "",
        image: imageUrl,
        link: bannerForm.link || "",
        buttonText: bannerForm.buttonText || "",
        order: parseInt(bannerForm.order) || 0,
      };

      console.log("Sending banner data:", payload);

      // Now create the banner with the image URL
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/banner/add`,
        payload
      );

      if (response.data.success) {
        toast.success("Banner added successfully");
        fetchBanners();
        // Reset form
        setBannerForm({
          title: "",
          description: "",
          image: "",
          link: "",
          buttonText: "",
          order: 0,
        });
        setBannerImageFile(null);
        setBannerImagePreview("");
      }
    } catch (error) {
      console.error("Add banner error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.error?.message) {
        toast.error(`Upload failed: ${error.response.data.error.message}`);
      } else {
        toast.error("Failed to add banner");
      }
    } finally {
      setIsLoading(false);
      setUploadingBannerImage(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/banner/delete/${id}`
      );
      if (response.data.success) {
        toast.success("Banner deleted");
        fetchBanners();
      }
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  // Discount Banner
  const handleAddDiscountBanner = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/discount/add`,
        discountForm
      );
      if (response.data.success) {
        toast.success("Discount banner added");
        fetchDiscountBanner();
        setDiscountForm({
          text: "",
          discountPercentage: "",
          backgroundColor: "#F59E0B",
          textColor: "#FFFFFF",
        });
      }
    } catch {
      toast.error("Failed to add discount banner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDiscountBanner = async () => {
    if (!discountBanner) return;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/discount/toggle/${
          discountBanner._id
        }`,
        { isActive: !discountBanner.isActive }
      );
      if (response.data.success) {
        toast.success("Discount banner updated");
        fetchDiscountBanner();
      }
    } catch {
      toast.error("Failed to toggle discount banner");
    }
  };

  // Featured Products
  const handleAddFeaturedProduct = async (productId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/featured/add`,
        { productId }
      );
      if (response.data.success) {
        toast.success("Product featured");
        fetchFeaturedProducts();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to feature product");
    }
  };

  const handleRemoveFeaturedProduct = async (id) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/homepage/featured/remove/${id}`
      );
      if (response.data.success) {
        toast.success("Product removed from featured");
        fetchFeaturedProducts();
      }
    } catch {
      toast.error("Failed to remove featured product");
    }
  };

  // Reviews - UPDATED FUNCTIONS
  // Duplicate fetchReviews function removed to resolve redeclaration error.

  const handleApproveReview = async (id) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shop/review/admin/approve/${id}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Review approved! It will now appear on homepage.");
        fetchReviews();
      }
    } catch (error) {
      console.error("Approve error:", error);
      toast.error(error.response?.data?.message || "Failed to approve review");
    }
  };

  const handleToggleReviewVisibility = async (id, isVisible) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shop/review/admin/toggle/${id}`,
        { isVisible: !isVisible },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(
          isVisible
            ? "Review hidden from homepage"
            : "Review is now visible on homepage"
        );
        fetchReviews();
      }
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to update review visibility");
    }
  };

  const handleDeleteReview = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shop/review/admin/delete/${id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Review deleted successfully");
        fetchReviews();
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete review");
    }
  };

  // Videos
  // AdminFeatures.jsx - Updated handleAddVideo function

  const handleAddVideo = async () => {
    if (!videoForm.videoFile || !videoForm.thumbnailFile) {
      toast.error("Please upload both video and thumbnail");
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Upload video to Cloudinary directly from frontend
      console.log("Uploading video to Cloudinary...");
      const videoFormData = new FormData();
      videoFormData.append("file", videoForm.videoFile);
      videoFormData.append(
        "upload_preset",
        import.meta.env.VITE_API_CLOUDINARY_UPLOAD_PRESET
      );

      const videoResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_API_CLOUDINARY_CLOUD_NAME
        }/video/upload`,
        videoFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Video upload: ${percentCompleted}%`);
          },
        }
      );

      if (!videoResponse.data.secure_url) {
        throw new Error("Video upload failed - no URL returned");
      }

      const videoUrl = videoResponse.data.secure_url;
      console.log("✅ Video uploaded:", videoUrl);

      // Step 2: Upload thumbnail to Cloudinary directly from frontend
      console.log("Uploading thumbnail to Cloudinary...");
      const thumbnailFormData = new FormData();
      thumbnailFormData.append("file", videoForm.thumbnailFile);
      thumbnailFormData.append(
        "upload_preset",
        import.meta.env.VITE_API_CLOUDINARY_UPLOAD_PRESET
      );

      const thumbnailResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_API_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        thumbnailFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Thumbnail upload: ${percentCompleted}%`);
          },
        }
      );

      if (!thumbnailResponse.data.secure_url) {
        throw new Error("Thumbnail upload failed - no URL returned");
      }

      const thumbnailUrl = thumbnailResponse.data.secure_url;
      console.log("✅ Thumbnail uploaded:", thumbnailUrl);

      // Step 3: Send URLs to your backend
      console.log("Sending URLs to backend...");
      const backendResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/videos/add`,
        {
          videoUrl,
          thumbnailUrl,
          order: videoForm.order,
        }
      );

      if (backendResponse.data.success) {
        toast.success("Video added successfully!");
        fetchVideos();
        setVideoForm({
          videoFile: null,
          thumbnailFile: null,
          order: 0,
        });
      } else {
        throw new Error(backendResponse.data.message || "Backend error");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);

      if (error.response?.data?.error?.message) {
        toast.error(`Cloudinary: ${error.response.data.error.message}`);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to upload video. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/homepage/videos/delete/${id}`
      );

      if (response.data.success) {
        toast.success("Video deleted successfully");
        fetchVideos();
      } else {
        toast.error("Failed to delete video");
      }
    } catch (error) {
      console.error("Delete video error:", error);
      toast.error("Failed to delete video");
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];

      if (type === "video") {
        if (!file.type.startsWith("video/")) {
          toast.error("Please upload a valid video file");
          return;
        }
        if (file.size > maxVideoSize) {
          toast.error(
            `Video size must be less than 100MB. Current: ${(
              file.size /
              1024 /
              1024
            ).toFixed(2)}MB`
          );
          return;
        }
        setVideoForm({ ...videoForm, videoFile: file });
        toast.success("Video selected");
      } else if (type === "thumbnail") {
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload a valid image file");
          return;
        }
        if (file.size > maxThumbnailSize) {
          toast.error(
            `Thumbnail size must be less than 5MB. Current: ${(
              file.size /
              1024 /
              1024
            ).toFixed(2)}MB`
          );
          return;
        }
        setVideoForm({ ...videoForm, thumbnailFile: file });
        toast.success("Thumbnail selected");
      }
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];

    if (!file) return;

    if (type === "video") {
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a valid video file (MP4, WebM, OGG)");
        return;
      }
      if (file.size > maxVideoSize) {
        toast.error(
          `Video size must be less than 100MB. Current: ${(
            file.size /
            1024 /
            1024
          ).toFixed(2)}MB`
        );
        return;
      }
      setVideoForm({ ...videoForm, videoFile: file });
      toast.success("Video selected");
    } else if (type === "thumbnail") {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file (JPG, PNG)");
        return;
      }
      if (file.size > maxThumbnailSize) {
        toast.error(
          `Thumbnail size must be less than 5MB. Current: ${(
            file.size /
            1024 /
            1024
          ).toFixed(2)}MB`
        );
        return;
      }
      setVideoForm({ ...videoForm, thumbnailFile: file });
      toast.success("Thumbnail selected");
    }
  };

  const handleBannerImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG, PNG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        `Image size must be less than 5MB. Current: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      return;
    }

    setBannerImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    toast.success("Image selected");
  };

  const removeBannerImage = () => {
  setBannerImageFile(null);
  setBannerImagePreview("");
  // Clear the file input
  const fileInput = document.getElementById("banner-image-input");
  if (fileInput) fileInput.value = "";
};

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-green-100 p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
          Homepage Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage banners, featured products, videos, and reviews
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-white/80 p-2 gap-2">
          <TabsTrigger
            value="banners"
            className="flex items-center justify-center px-2 sm:px-4"
          >
            <Image className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Banners</span>
          </TabsTrigger>

          <TabsTrigger
            value="discount"
            className="flex items-center justify-center px-2 sm:px-4"
          >
            <Tag className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Discount</span>
          </TabsTrigger>

          <TabsTrigger
            value="featured"
            className="flex items-center justify-center px-2 sm:px-4"
          >
            <Package className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Featured</span>
          </TabsTrigger>

          <TabsTrigger
            value="videos"
            className="flex items-center justify-center px-2 sm:px-4"
          >
            <Video className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>

          <TabsTrigger
            value="reviews"
            className="flex items-center justify-center px-2 sm:px-4 relative"
          >
            <Star className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Reviews</span>
            {reviews.filter((r) => !r.isApproved).length > 0 && (
              <Badge className="absolute -top-1 -right-1 sm:static sm:ml-2 bg-red-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                {reviews.filter((r) => !r.isApproved).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        {/* Banners Tab */}
        <TabsContent value="banners">
          <Card className="bg-white/80">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Carousel Banners</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Banner
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Banner</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={bannerForm.title}
                          onChange={(e) =>
                            setBannerForm({
                              ...bannerForm,
                              title: e.target.value,
                            })
                          }
                          placeholder="Banner title"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={bannerForm.description}
                          onChange={(e) =>
                            setBannerForm({
                              ...bannerForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Banner description"
                          rows={3}
                        />
                      </div>

                      {/* ✅ NEW: Image Upload Section */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          🖼️ Banner Image
                        </Label>

                        {/* Image Preview */}
                        {bannerImagePreview && (
                          <div className="mb-3 relative">
                            <img
                              src={bannerImagePreview}
                              alt="Banner preview"
                              className="w-full h-48 object-cover rounded-lg border-2 border-green-300"
                            />
                            <button
                              type="button"
                              onClick={removeBannerImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition-all hover:scale-110"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Upload Button */}
                        {!bannerImagePreview && (
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-400 transition-all group">
                            <div className="flex flex-col items-center">
                              <Image className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                              <span className="text-sm text-gray-600 font-medium">
                                Upload Banner Image
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                JPG, PNG, WebP (Max 5MB)
                              </span>
                            </div>
                            <input
                              id="banner-image-input"
                              type="file"
                              accept="image/*"
                              onChange={handleBannerImageUpload}
                              className="hidden"
                            />
                          </label>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                          Recommended size: 1920x600px or 16:5 ratio
                        </p>
                      </div>

                      {/* Optional: Image URL (if they want to use URL instead) */}
                      <div>
                        <Label className="text-sm">
                          Or enter Image URL (optional)
                        </Label>
                        <Input
                          value={bannerForm.image}
                          onChange={(e) =>
                            setBannerForm({
                              ...bannerForm,
                              image: e.target.value,
                            })
                          }
                          placeholder="https://example.com/image.jpg"
                          disabled={!!bannerImageFile}
                        />
                        {bannerImageFile && (
                          <p className="text-xs text-gray-500 mt-1">
                            Image file selected. URL input disabled.
                          </p>
                        )}
                      </div>

                      {/* Link */}
                      <div>
                        <Label>Link (optional)</Label>
                        <Input
                          value={bannerForm.link}
                          onChange={(e) =>
                            setBannerForm({
                              ...bannerForm,
                              link: e.target.value,
                            })
                          }
                          placeholder="/shop/listing or https://example.com"
                        />
                      </div>

                      {/* Button Text */}
                      <div>
                        <Label>Button Text (optional)</Label>
                        <Input
                          value={bannerForm.buttonText}
                          onChange={(e) =>
                            setBannerForm({
                              ...bannerForm,
                              buttonText: e.target.value,
                            })
                          }
                          placeholder="Shop Now"
                        />
                      </div>

                      {/* Order */}
                      <div>
                        <Label>Display Order</Label>
                        <Input
                          type="number"
                          value={bannerForm.order}
                          onChange={(e) =>
                            setBannerForm({
                              ...bannerForm,
                              order: parseInt(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Lower numbers appear first
                        </p>
                      </div>

                      {/* Submit Button */}
                      <Button
                        onClick={handleAddBanner}
                        disabled={
                          isLoading ||
                          uploadingBannerImage ||
                          (!bannerImageFile && !bannerForm.image)
                        }
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {uploadingBannerImage || isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            {uploadingBannerImage
                              ? "Uploading Image..."
                              : "Creating Banner..."}
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Banner
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {banners.map((banner) => (
                  <Card key={banner._id} className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-32 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{banner.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {banner.description}
                          </p>
                          <Badge
                            className={
                              banner.isActive ? "bg-green-500" : "bg-gray-500"
                            }
                          >
                            {banner.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteBanner(banner._id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discount Tab */}

        <TabsContent value="discount">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle>Discount Banner</CardTitle>
            </CardHeader>
            <CardContent>
              {discountBanner ? (
                <Card className="border-orange-200 mb-4">
                  <CardContent className="p-4">
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: discountBanner.backgroundColor,
                        color: discountBanner.textColor,
                      }}
                    >
                      <p className="text-center font-bold">
                        {discountBanner.text}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Badge
                        className={
                          discountBanner.isActive
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }
                      >
                        {discountBanner.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button onClick={handleToggleDiscountBanner}>
                        {discountBanner.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <div className="space-y-4">
                <div>
                  <Label>Discount Text</Label>
                  <Input
                    value={discountForm.text}
                    onChange={(e) =>
                      setDiscountForm({
                        ...discountForm,
                        text: e.target.value,
                      })
                    }
                    placeholder="Get 20% OFF on all products!"
                  />
                </div>
                <div>
                  <Label>Discount Percentage</Label>
                  <Input
                    type="number"
                    value={discountForm.discountPercentage}
                    onChange={(e) =>
                      setDiscountForm({
                        ...discountForm,
                        discountPercentage: e.target.value,
                      })
                    }
                    placeholder="20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Background Color</Label>
                    <Input
                      type="color"
                      value={discountForm.backgroundColor}
                      onChange={(e) =>
                        setDiscountForm({
                          ...discountForm,
                          backgroundColor: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Text Color</Label>
                    <Input
                      type="color"
                      value={discountForm.textColor}
                      onChange={(e) =>
                        setDiscountForm({
                          ...discountForm,
                          textColor: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddDiscountBanner}
                  disabled={isLoading}
                  className="w-full"
                >
                  Create Discount Banner
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Featured Products Tab */}
        <TabsContent value="featured">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80">
              <CardHeader>
                <CardTitle>Current Featured Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featuredProducts.map((fp) => (
                    <Card key={fp._id} className="border-green-200">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={fp.productId?.image}
                            alt={fp.productId?.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold text-sm">
                              {fp.productId?.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ₹{fp.productId?.price}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveFeaturedProduct(fp._id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80">
              <CardHeader>
                <CardTitle>Add Featured Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {productList?.map((product) => (
                    <Card key={product._id} className="border-gray-200">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold text-sm">
                              {product.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ₹{product.price}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddFeaturedProduct(product._id)}
                          disabled={featuredProducts.some(
                            (fp) => fp.productId?._id === product._id
                          )}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Feature
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Videos Tab */}
        <TabsContent value="videos">
          <Card className="bg-white/80">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Homepage Videos</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Video
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Video</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Video Upload */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          📹 Video File (MP4, WebM, OGG)
                        </Label>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, "video")}
                          onClick={() =>
                            document.getElementById("video-input").click()
                          }
                        >
                          {videoForm.videoFile ? (
                            <div className="space-y-2">
                              <Video className="w-8 h-8 mx-auto text-green-600" />
                              <p className="text-sm font-medium text-gray-800">
                                {videoForm.videoFile.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(
                                  videoForm.videoFile.size /
                                  1024 /
                                  1024
                                ).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Video className="w-8 h-8 mx-auto text-gray-400" />
                              <p className="text-sm font-medium text-gray-700">
                                Drag & drop your video here
                              </p>
                              <p className="text-xs text-gray-500">
                                or click to select file (Max 100MB)
                              </p>
                            </div>
                          )}
                        </div>
                        <input
                          id="video-input"
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleFileSelect(e, "video")}
                          className="hidden"
                        />
                        {videoForm.videoFile && (
                          <button
                            onClick={() =>
                              setVideoForm({ ...videoForm, videoFile: null })
                            }
                            className="mt-2 text-xs text-red-600 hover:text-red-700"
                          >
                            Remove video
                          </button>
                        )}
                      </div>

                      {/* Thumbnail Upload */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">
                          🖼️ Thumbnail Image (JPG, PNG)
                        </Label>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, "thumbnail")}
                          onClick={() =>
                            document.getElementById("thumbnail-input").click()
                          }
                        >
                          {videoForm.thumbnailFile ? (
                            <div className="space-y-2">
                              <img
                                src={URL.createObjectURL(
                                  videoForm.thumbnailFile
                                )}
                                alt="Thumbnail preview"
                                className="w-full h-32 object-cover rounded mx-auto"
                              />
                              <p className="text-sm font-medium text-gray-800">
                                {videoForm.thumbnailFile.name}
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Image className="w-8 h-8 mx-auto text-gray-400" />
                              <p className="text-sm font-medium text-gray-700">
                                Drag & drop your thumbnail here
                              </p>
                              <p className="text-xs text-gray-500">
                                or click to select file (Max 5MB)
                              </p>
                            </div>
                          )}
                        </div>
                        <input
                          id="thumbnail-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(e, "thumbnail")}
                          className="hidden"
                        />
                        {videoForm.thumbnailFile && (
                          <button
                            onClick={() =>
                              setVideoForm({
                                ...videoForm,
                                thumbnailFile: null,
                              })
                            }
                            className="mt-2 text-xs text-red-600 hover:text-red-700"
                          >
                            Remove thumbnail
                          </button>
                        )}
                      </div>

                      {/* Order */}
                      <div>
                        <Label className="text-base font-semibold mb-2 block">
                          Display Order
                        </Label>
                        <Input
                          type="number"
                          value={videoForm.order}
                          onChange={(e) =>
                            setVideoForm({
                              ...videoForm,
                              order: parseInt(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                          className="border-yellow-300"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Lower numbers appear first
                        </p>
                      </div>

                      {/* Submit Button */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleAddVideo}
                          disabled={
                            isLoading ||
                            !videoForm.videoFile ||
                            !videoForm.thumbnailFile
                          }
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Add Video
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {videos.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium">No videos yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Add videos to showcase on your homepage
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map((video) => (
                    <Card
                      key={video._id}
                      className="border-green-200 overflow-hidden"
                    >
                      <div className="relative group">
                        <img
                          src={video.thumbnailUrl}
                          alt="Video thumbnail"
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                        <Badge
                          className={`absolute top-2 right-2 ${
                            video.isActive ? "bg-green-500" : "bg-gray-500"
                          }`}
                        >
                          {video.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500">
                              Order: {video.order}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteVideo(video._id)}
                            className="w-full border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* Reviews Tab - UPDATED */}
        <TabsContent value="reviews">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-green-100">
            <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    Customer Reviews Management
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage and moderate product reviews
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-300 px-3 py-1.5 font-semibold"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {reviews.filter((r) => !r.isApproved).length} Pending
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-300 px-3 py-1.5 font-semibold"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {reviews.filter((r) => r.isApproved).length} Approved
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-300 px-3 py-1.5 font-semibold"
                  >
                    <Package className="w-3 h-3 mr-1" />
                    {reviews.length} Total
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {reviews.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center">
                    <Star className="w-10 h-10 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Reviews will appear here once customers start reviewing
                    products. Approved reviews will be displayed on the
                    homepage.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Pending Reviews Section */}
                  {reviews.filter((r) => !r.isApproved).length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        Pending Approval
                      </h3>
                      <div className="space-y-3">
                        {reviews
                          .filter((r) => !r.isApproved)
                          .map((review) => (
                            <Card
                              key={review._id}
                              className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50/50 to-orange-50/30 hover:shadow-lg transition-all duration-200"
                            >
                              <CardContent className="p-5">
                                <div className="flex flex-col lg:flex-row gap-4">
                                  {/* Review Content */}
                                  <div className="flex-1">
                                    {/* User Info */}
                                    <div className="flex items-start gap-3 mb-3">
                                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                                        {review.userName?.[0]?.toUpperCase() ||
                                          "U"}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                          <p className="font-bold text-gray-800">
                                            {review.userName}
                                          </p>
                                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                                            NEW
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                              <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                  i < review.reviewValue
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                              />
                                            ))}
                                          </div>
                                          <span className="text-xs text-gray-500">
                                            {new Date(
                                              review.createdAt
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-sm text-gray-700 mb-3 leading-relaxed bg-white p-3 rounded-lg border border-yellow-200">
                                      "{review.reviewMessage}"
                                    </p>

                                    {/* Review Images */}
                                    {review.images &&
                                      review.images.length > 0 && (
                                        <div className="flex gap-2 mb-3 flex-wrap">
                                          {review.images.map(
                                            (img, imgIndex) => (
                                              <img
                                                key={imgIndex}
                                                src={img}
                                                alt={`Review ${imgIndex + 1}`}
                                                className="w-16 h-16 object-cover rounded-lg border-2 border-yellow-300 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                                                onClick={() =>
                                                  window.open(img, "_blank")
                                                }
                                              />
                                            )
                                          )}
                                        </div>
                                      )}

                                    {/* Product Info */}
                                    {review.productId && (
                                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <img
                                          src={review.productId.image}
                                          alt={review.productId.title}
                                          className="w-12 h-12 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-semibold text-gray-800 truncate">
                                            {review.productId.title}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Product Review
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                                    <Button
                                      size="sm"
                                      className="flex-1 lg:w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all"
                                      onClick={() =>
                                        handleApproveReview(review._id)
                                      }
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 lg:w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                                      onClick={() =>
                                        handleDeleteReview(review._id)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Approved Reviews Section */}
                  {reviews.filter((r) => r.isApproved).length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Approved Reviews (
                        {reviews.filter((r) => r.isApproved).length})
                      </h3>
                      <div className="space-y-3">
                        {reviews
                          .filter((r) => r.isApproved)
                          .map((review) => (
                            <Card
                              key={review._id}
                              className="border-2 border-green-200 bg-gradient-to-br from-green-50/30 to-emerald-50/20 hover:shadow-md transition-all duration-200"
                            >
                              <CardContent className="p-5">
                                <div className="flex flex-col lg:flex-row gap-4">
                                  {/* Review Content */}
                                  <div className="flex-1">
                                    {/* User Info */}
                                    <div className="flex items-start gap-3 mb-3">
                                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                                        {review.userName?.[0]?.toUpperCase() ||
                                          "U"}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                          <p className="font-bold text-gray-800">
                                            {review.userName}
                                          </p>
                                          <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            LIVE
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                              <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                  i < review.reviewValue
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                              />
                                            ))}
                                          </div>
                                          <span className="text-xs text-gray-500">
                                            {new Date(
                                              review.createdAt
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-sm text-gray-700 mb-3 leading-relaxed bg-white p-3 rounded-lg border border-green-200">
                                      "{review.reviewMessage}"
                                    </p>

                                    {/* Review Images */}
                                    {review.images &&
                                      review.images.length > 0 && (
                                        <div className="flex gap-2 mb-3 flex-wrap">
                                          {review.images.map(
                                            (img, imgIndex) => (
                                              <img
                                                key={imgIndex}
                                                src={img}
                                                alt={`Review ${imgIndex + 1}`}
                                                className="w-16 h-16 object-cover rounded-lg border-2 border-green-300 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                                                onClick={() =>
                                                  window.open(img, "_blank")
                                                }
                                              />
                                            )
                                          )}
                                        </div>
                                      )}

                                    {/* Product Info */}
                                    {review.productId && (
                                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                        <img
                                          src={review.productId.image}
                                          alt={review.productId.title}
                                          className="w-12 h-12 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-semibold text-gray-800 truncate">
                                            {review.productId.title}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Showing on Homepage
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 lg:w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                                      onClick={() =>
                                        handleToggleReviewVisibility(
                                          review._id,
                                          review.isVisible
                                        )
                                      }
                                    >
                                      {review.isVisible ? (
                                        <>
                                          <Eye className="w-4 h-4 mr-1" />
                                          Show
                                        </>
                                      ) : (
                                        <>
                                          <EyeOff className="w-4 h-4 mr-1" />
                                          Hide
                                        </>
                                      )}
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="flex-1 lg:w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                                      onClick={() =>
                                        handleDeleteReview(review._id)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default AdminFeatures;
