import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Calendar, CreditCard, MapPin, ShoppingBag, User, Phone, Home } from "lucide-react";
import { toast } from "sonner";

const AdminOrderDetailsView = ({ orderDetails, onUpdateStatus, onRefresh }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!orderDetails) {
    return (
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[700px]">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </DialogContent>
    );
  }

  const handleUpdateStatus = async (e) => {
  e.preventDefault();
  
  if (!selectedStatus) {
    toast.error("Please select a status");
    return;
  }

  setIsUpdating(true);
  try {
    const result = await onUpdateStatus(orderDetails._id, selectedStatus);
    if (result?.success) {
      toast.success("Order status updated successfully");
      if (onRefresh) onRefresh();
      setSelectedStatus("");
    } else {
      toast.error(result?.message || "Failed to update status");
    }
  } catch (error) {
    toast.error("Error updating status");
  } finally {
    setIsUpdating(false);
  }
};

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "confirmed":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "inprocess":
        return "bg-blue-500";
      case "inshipping":
        return "bg-purple-500";
      case "rejected":
        return "bg-red-500";
      case "refunded":
        return "bg-purple-600";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DialogContent className="w-full max-w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-green-50/50 to-white p-0">
      <div className="space-y-3 sm:space-y-6 p-3 sm:p-4">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-green-200">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              Order Details
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Manage order information and status</p>
          </div>
        </div>

        {/* Order Info Card */}
        <Card className="border-green-200 shadow-sm">
          <div className="p-3 sm:p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <ShoppingBag className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="font-mono font-semibold text-xs sm:text-sm break-all">{orderDetails._id}</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(orderDetails.orderStatus)} text-white text-xs flex-shrink-0`}>
                {orderDetails.orderStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Order Date</p>
                  <p className="font-semibold text-xs sm:text-sm">
                    {new Date(orderDetails.orderDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Payment Method</p>
                  <p className="font-semibold text-xs sm:text-sm capitalize">{orderDetails.paymentMethod}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 sm:pt-3 border-t border-green-100 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Payment Status</p>
                <Badge variant={orderDetails.paymentStatus === 'paid' ? 'default' : 'secondary'} className="mt-1 text-xs">
                  {orderDetails.paymentStatus}
                </Badge>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  ₹{orderDetails.totalAmount?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Separator className="bg-green-200" />

        {/* Order Items */}
        <div>
          <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            Order Items
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {orderDetails.cartItems && orderDetails.cartItems.length > 0 ? (
              orderDetails.cartItems.map((item, index) => (
                <Card key={index} className="border-green-200 shadow-sm">
                  <div className="p-2 sm:p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={item.image || '/api/placeholder/60/60'}
                        alt={item.title}
                        className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg object-cover border-2 border-green-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs sm:text-sm text-gray-800 line-clamp-2">{item.title}</p>
                        <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                          <span className="text-xs text-gray-400">|</span>
                          <span className="text-xs sm:text-sm font-bold text-green-600">₹{item.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pl-12 sm:pl-0 sm:text-right border-t border-green-100 pt-2">
                      <p className="text-xs text-muted-foreground">Subtotal</p>
                      <p className="font-bold text-xs sm:text-sm text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-xs sm:text-sm">No items found</p>
            )}
          </div>
        </div>

        <Separator className="bg-green-200" />

        {/* Customer & Shipping Info */}
        <div>
          <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            Customer & Shipping Information
          </h3>
          <Card className="border-green-200 shadow-sm bg-gradient-to-br from-green-50/50 to-white">
            <div className="p-3 sm:p-4 space-y-3">
              {/* Customer Name */}
              <div className="flex items-center gap-2 pb-2 border-b border-green-100">
                <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Customer Name</p>
                  <p className="font-semibold text-sm text-gray-800">
                    {orderDetails.customerName || 'Customer'}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2">
                <Home className="w-4 h-4 text-green-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Delivery Address</p>
                  <p className="text-xs sm:text-sm text-gray-700 break-words">
                    {orderDetails.addressInfo?.address || 'No address provided'}
                  </p>
                </div>
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">City</p>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">
                    {orderDetails.addressInfo?.city || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">State</p>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">
                    {orderDetails.addressInfo?.state || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pincode</p>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">
                    {orderDetails.addressInfo?.pincode || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2 pt-2 border-t border-green-100">
                <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium break-all">
                    {orderDetails.addressInfo?.mobileNo || 
                     orderDetails.addressInfo?.phone || 
                     'N/A'}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {orderDetails.addressInfo?.notes && (
                <div className="pt-2 border-t border-green-100">
                  <p className="text-xs text-muted-foreground mb-1">Delivery Notes</p>
                  <p className="text-xs sm:text-sm text-gray-600 italic bg-yellow-50 p-2 rounded border border-yellow-200">
                    {orderDetails.addressInfo.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        <Separator className="bg-green-200" />

        {/* Update Status Form */}
        <div>
          <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3">Update Order Status</h3>
          <Card className="border-green-200 bg-gradient-to-br from-green-50/30 to-white">
            <div className="p-3 sm:p-4">
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
                    Order Status
                  </Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="inProcess">In Process</SelectItem>
                      <SelectItem value="inShipping">In Shipping</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isUpdating || !selectedStatus}
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Order Status"
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminOrderDetailsView;