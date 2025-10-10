import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DialogContent } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import useAuthStore from '@/store/auth-slice/auth-store';
import { Package, Calendar, CreditCard, MapPin, ShoppingBag, CheckCircle, RefreshCw } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const ShoppingOrderDetailsView = ({ orderDetails }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (!orderDetails) {
    return (
      <DialogContent className="sm:max-w-[650px]">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
        </div>
      </DialogContent>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "delivered":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      case "cancelled":
        return "bg-gray-500";
      case "refunded":
        return "bg-purple-500";
      case "inprocess":
        return "bg-blue-500";
      case "inshipping":
        return "bg-purple-400";
      default:
        return "bg-gray-500";
    }
  };

  // Check if refund can be requested
  const canRequestRefund = 
    orderDetails?.data?.paymentStatus === 'paid' && 
    orderDetails?.data?.orderStatus !== 'cancelled' &&
    orderDetails?.data?.orderStatus !== 'rejected' &&
    orderDetails?.data?.orderStatus !== 'refunded';

  const handleRequestRefund = () => {
    // Redirect to refund request page with order ID
    navigate(`/shop/refund-request?orderId=${orderDetails?.data?._id}`);
  };

  return (
    <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-yellow-50/50 to-white">
      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-yellow-200">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Order Details
            </h2>
            <p className="text-sm text-gray-600">Track your order information</p>
          </div>
        </div>

        {/* Order Info Card */}
        <Card className="border-yellow-200 shadow-sm">
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-mono font-semibold text-sm">{orderDetails?.data._id}</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(orderDetails?.data.orderStatus)} text-white`}>
                {orderDetails?.data.orderStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-xs text-gray-500">Order Date</p>
                  <p className="font-semibold text-sm">
                    {new Date(orderDetails?.data.orderDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-xs text-gray-500">Payment</p>
                  <p className="font-semibold text-sm capitalize">{orderDetails?.data.paymentMethod}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-yellow-100">
              <span className="text-gray-700 font-medium">Total Amount</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                ₹{orderDetails?.data.totalAmount?.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">
                Payment Status: <span className="font-semibold capitalize">{orderDetails?.data.paymentStatus}</span>
              </span>
            </div>
          </div>
        </Card>

        {/* Refund Button - Only show if eligible */}
        {canRequestRefund && (
          <>
            <Separator className="bg-yellow-200" />
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Need a refund?</h4>
                  <p className="text-sm text-gray-600">Request a refund with product image and reason</p>
                </div>
                <Button
                  onClick={handleRequestRefund}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Request Refund
                </Button>
              </div>
            </div>
          </>
        )}

        <Separator className="bg-yellow-200" />

        {/* Order Items */}
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-yellow-600" />
            Order Items
          </h3>
          <div className="space-y-3">
            {orderDetails?.data.cartItems && orderDetails?.data.cartItems.length > 0 ? (
              orderDetails?.data.cartItems.map((item, index) => (
                <Card key={index} className="border-yellow-200 shadow-sm">
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={item.image || '/api/placeholder/60/60'}
                        alt={item.title}
                        className="w-14 h-14 rounded-lg object-cover border-2 border-yellow-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-800 truncate">{item.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                          <span className="text-xs text-gray-400">|</span>
                          <span className="text-sm font-bold text-yellow-600">₹{item.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Subtotal</p>
                      <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No items found</p>
            )}
          </div>
        </div>

        <Separator className="bg-yellow-200" />

        {/* Shipping Info */}
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-yellow-600" />
            Delivery Address
          </h3>
          <Card className="border-yellow-200 shadow-sm bg-gradient-to-br from-yellow-50/50 to-white">
            <div className="p-4 space-y-2">
              <p className="font-semibold text-gray-800">{user?.userName || user?.name}</p>
              <p className="text-sm text-gray-700">{orderDetails?.data?.addressInfo?.address}</p>
              <p className="text-sm text-gray-700">
                {orderDetails?.data?.addressInfo?.city}, {orderDetails?.data?.addressInfo?.pincode}
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <span className="font-medium">Phone:</span>
                {orderDetails?.data?.addressInfo?.mobileNo || orderDetails?.data?.addressInfo?.phone}
              </p>
              {orderDetails?.data?.addressInfo?.notes && (
                <p className="text-sm text-gray-600 italic border-t border-yellow-200 pt-2 mt-2">
                  Note: {orderDetails?.data?.addressInfo?.notes}
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DialogContent>
  );
};

export default ShoppingOrderDetailsView;