import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useRefundStore from "@/store/shop/refund-store";
import useAuthStore from "@/store/auth-slice/auth-store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const refundReasons = [
  "Product damaged",
  "Wrong item received",
  "Product not as described",
  "Other"
];

const RefundRequestPage = ({ orderId }) => {
  const { user } = useAuthStore();
  const { createRefundRequest, isLoading } = useRefundStore();
  const navigate = useNavigate();
  
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!reason && !otherReason) {
      toast.error("Please select or write a reason for refund");
      return;
    }
    
    if (!image) {
      toast.error("Please upload a product image");
      return;
    }
    
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("userId", user?.id || user?._id);
    formData.append("reason", reason === "Other" ? otherReason : reason);
    formData.append("productImage", image);
    
    const result = await createRefundRequest(formData);
    
    if (result?.success) {
      toast.success("Refund request submitted successfully");
      
      // Clear form fields
      setReason("");
      setOtherReason("");
      setImage(null);
      setImagePreview(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
      // Redirect to orders page after 1 second
      setTimeout(() => {
        navigate("/shop/account");
      }, 1000);
    } else {
      toast.error(result?.message || "Refund request failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-4">
      <Card className="max-w-lg w-full border-yellow-200 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Request Refund
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Please provide product image and reason for refund request
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Upload Product Image *
              </label>
              <Input 
                id="file-input"
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="border-yellow-200"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img 
                    src={imagePreview} 
                    alt="Product Preview" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-yellow-200 shadow-md" 
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Reason for Refund *
              </label>
              <select
                className="w-full border-2 border-yellow-200 rounded-lg p-3 focus:outline-none focus:border-yellow-400 transition-colors"
                value={reason}
                onChange={e => setReason(e.target.value)}
              >
                <option value="">Select reason</option>
                {refundReasons.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              
              {reason === "Other" && (
                <Textarea
                  className="mt-3 border-2 border-yellow-200 focus:border-yellow-400"
                  placeholder="Please describe your reason..."
                  value={otherReason}
                  onChange={e => setOtherReason(e.target.value)}
                  rows={4}
                />
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                onClick={() => navigate("/shop/account")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefundRequestPage;