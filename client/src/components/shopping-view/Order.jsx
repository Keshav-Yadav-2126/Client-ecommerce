import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import useAuthStore from "@/store/auth-slice/auth-store";
import ShoppingOrderDetailsView from "../../components/shopping-view/order-details";
import { Badge } from "../ui/badge";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import useOrderStore from "@/store/shop/order-store";
import { Package, Eye, Loader2, ShoppingBag } from "lucide-react";

const ShoppingOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useAuthStore();
  const { 
    orderList, 
    orderDetails, 
    getAllOrdersByUserId, 
    getOrderDetails, 
    resetOrderDetails,
    isLoading 
  } = useOrderStore();

  function handleFetchOrderDetails(getId) {
    getOrderDetails(getId);
  }

  useEffect(() => {
    if (user?.id || user?._id) {
      getAllOrdersByUserId(user?.id || user?._id);
    }
  }, [user]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "delivered":
        return "bg-green-500 hover:bg-green-600";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "rejected":
      case "cancelled":
        return "bg-red-500 hover:bg-red-600";
      case "processing":
        return "bg-blue-500 hover:bg-blue-600";
      case "shipped":
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  if (isLoading) {
    return (
      <Card className="border-yellow-200">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Order History
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {!orderList || orderList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-600 text-center text-sm">
              Start shopping to see your orders here!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Mobile View */}
            <div className="block md:hidden space-y-4 p-4">
              {[...orderList]
                .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                .map((orderItem) => (
                  <Card key={orderItem?._id} className="border-yellow-200 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Order ID</p>
                          <p className="text-sm font-mono font-semibold text-gray-800">
                            {orderItem?._id?.slice(-8)}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(orderItem?.orderStatus)} text-white`}>
                          {orderItem?.orderStatus}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="text-sm font-medium">
                            {new Date(orderItem.orderDate).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="text-lg font-bold text-yellow-600">
                            ₹{orderItem?.totalAmount?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <Dialog
                        open={openDetailsDialog && orderDetails?.data?._id === orderItem?._id}
                        onOpenChange={(open) => {
                          if (!open) {
                            resetOrderDetails();
                            setOpenDetailsDialog(false);
                          }
                        }}
                      >
                        <Button
                          onClick={() => handleFetchOrderDetails(orderItem?._id)}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        {orderDetails && orderDetails?.data?._id === orderItem?._id && (
                          <ShoppingOrderDetailsView orderDetails={orderDetails} />
                        )}
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-yellow-50 hover:bg-yellow-50">
                    <TableHead className="font-bold text-gray-700">Order ID</TableHead>
                    <TableHead className="font-bold text-gray-700">Order Date</TableHead>
                    <TableHead className="font-bold text-gray-700">Status</TableHead>
                    <TableHead className="font-bold text-gray-700">Total Amount</TableHead>
                    <TableHead className="text-right font-bold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...orderList]
                    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                    .map((orderItem) => (
                      <TableRow key={orderItem?._id} className="hover:bg-yellow-50/50">
                        <TableCell className="font-mono text-sm">
                          {orderItem?._id?.slice(-8)}
                        </TableCell>
                        <TableCell>
                          {new Date(orderItem.orderDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(orderItem?.orderStatus)} text-white`}>
                            {orderItem?.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-yellow-600">
                          ₹{orderItem?.totalAmount?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog
                            open={openDetailsDialog && orderDetails?.data?._id === orderItem?._id}
                            onOpenChange={(open) => {
                              if (!open) {
                                resetOrderDetails();
                                setOpenDetailsDialog(false);
                              }
                            }}
                          >
                            <Button
                              onClick={() => handleFetchOrderDetails(orderItem?._id)}
                              variant="outline"
                              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            {orderDetails && orderDetails?.data?._id === orderItem?._id && (
                              <ShoppingOrderDetailsView orderDetails={orderDetails} />
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingOrders