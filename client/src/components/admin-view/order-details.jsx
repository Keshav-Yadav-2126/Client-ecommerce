import useAuthStore from "@/store/auth-slice/auth-store";
import { Label } from "../ui/label";
import { DialogContent } from "../ui/dialog";
import { FormInput } from "../common/form";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import useAdminOrderStore from "@/store/admin/order-store";
import { Card } from "../ui/card";
import { Package, Calendar, CreditCard, MapPin, ShoppingBag, User } from "lucide-react";

const initialFormData = {
  status: "",
};

const AdminOrderDetailsView = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useAuthStore();
  const { updateOrderStatus, getOrderDetailsForAdmin, getAllOrdersForAdmin } = useAdminOrderStore();

  if (!orderDetails) {
    return (
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[700px]">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </DialogContent>
    );
  }

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    if (!status) {
      toast.error("Please select a status");
      return;
    }

    updateOrderStatus({ id: orderDetails?._id, orderStatus: status }).then((data) => {
      if (data?.success) {
        getOrderDetailsForAdmin(orderDetails?._id);
        getAllOrdersForAdmin();
        setFormData(initialFormData);
        toast.success(data?.message || "Order status updated successfully", {
          duration: 2000,
        });
      } else {
        toast.error(data?.message || "Failed to update status");
      }
    });
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
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
                  ₹{orderDetails.totalAmount.toFixed(2)}
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

        {/* Shipping Info */}
        <div>
          <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            Shipping Information
          </h3>
          <Card className="border-green-200 shadow-sm bg-gradient-to-br from-green-50/50 to-white">
            <div className="p-3 sm:p-4 space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="font-semibold text-xs sm:text-sm text-gray-800 break-words">{user?.userName || user?.name || 'Customer'}</p>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 break-words">{orderDetails.addressInfo?.address}</p>
              <p className="text-xs sm:text-sm text-gray-700">
                {orderDetails.addressInfo?.city}, {orderDetails.addressInfo?.state || 'N/A'}
              </p>
              <p className="text-xs sm:text-sm text-gray-700">
                Pincode: {orderDetails.addressInfo?.pincode}
              </p>
              <p className="text-xs sm:text-sm text-gray-700 flex items-center gap-2">
                <span className="font-medium flex-shrink-0">Phone:</span>
                {/* Previous implementation (kept for reference): */}
                {/* <span className="break-all">{orderDetails?.data?.addressInfo?.mobileNo || orderDetails?.data?.addressInfo?.phone}</span> */}
                {/* Use top-level addressInfo consistently — some payloads put addressInfo at root (orderDetails.addressInfo) */}
                <span className="break-all">
                  {orderDetails?.addressInfo?.mobileNo || orderDetails?.addressInfo?.phone || orderDetails?.data?.addressInfo?.mobileNo || orderDetails?.data?.addressInfo?.phone || 'N/A'}
                </span>
              </p>
              {/* <span className="break-all">{orderDetails?.data?.addressInfo?.mobileNo || orderDetails?.data?.addressInfo?.phone}</span> */}
              {orderDetails.addressInfo?.notes && (
                <p className="text-xs sm:text-sm text-gray-600 italic border-t border-green-200 pt-2 mt-2">
                  Note: {orderDetails.addressInfo.notes}
                </p>
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
              <FormInput
                formControls={[
                  {
                    label: "Order Status",
                    name: "status",
                    componentType: "select",
                    options: [
                      { id: "pending", label: "Pending" },
                      { id: "inProcess", label: "In Process" },
                      { id: "inShipping", label: "In Shipping" },
                      { id: "delivered", label: "Delivered" },
                      { id: "rejected", label: "Rejected" },
                    ],
                  },
                ]}
                formData={formData}
                setFormData={setFormData}
                buttonText="Update Order Status"
                onSubmit={handleUpdateStatus}
              />
            </div>
          </Card>
        </div>
      </div>
    </DialogContent>
  );
};

export default AdminOrderDetailsView;