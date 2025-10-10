import React, { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CloudUpload, File, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

const ProductImageUpload = ({
  file,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) => {
  const inputRef = useRef(null);

  function handleImageFileChange(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // Clear the input value
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
    }
  }

  async function uploadedImageToCloudinary() {
    setImageLoadingState(true);
    if (!file) return;
    const data = new FormData();
    data.append("my-file", file); // key must match backend
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,
        data,
        { withCredentials: true }
      );
      console.log("response of image: ",response)
      if (response.data && response.data.imageUrl) {
        setUploadedImageUrl(response.data.imageUrl);
        setImageLoadingState(false);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      // Optionally show a toast or error message here
    }
  }

  useEffect(() => {
    if (file !== null) {
      uploadedImageToCloudinary();
    }
  }, [file]);

  return (
    <div className={`w-full mb-2 ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60" : ""}border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          ref={inputRef}
          onChange={handleImageFileChange}
          className="hidden"
          disabled={isEditMode}
        />
        {!file ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? "cursor-not-allowed" : ""}flex flex-col items-center justify-center ${isEditMode ? "opacity-60" : "cursor-pointer"} h-32`}
            style={isEditMode ? { pointerEvents: 'none' } : {}}
          >
            <CloudUpload className="w-10 h-10 text-muted-foreground mb-2" />
            <span className="">Drag & Drop or Click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-green-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{file.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageUpload;
