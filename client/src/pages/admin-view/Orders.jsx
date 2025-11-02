import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useAdminOrderStore from "@/store/admin/order-store";
import AdminOrderDetailsView from "@/components/admin-view/order-details";
import { 
  Package, 
  Eye, 
  Bell, 
  Filter,
  Search,
  Download,
  RefreshCw 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminOrders = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  
  const {
    orderList,
    orderDetails,
    resetOrderDetails,
    getOrderDetailsForAdmin,
    getAllOrdersForAdmin,
    updateOrderStatus,
    isLoading,
  } = useAdminOrderStore();

  async function handleFetchOrderDetails(getId) {
    await getOrderDetailsForAdmin(getId);
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    const result = await updateOrderStatus({ id: orderId, orderStatus: newStatus });
    if (result?.success) {
      // Refresh order details
      await getOrderDetailsForAdmin(orderId);
      // Refresh order list
      await getAllOrdersForAdmin();
    }
    return result;
  };

  useEffect(() => {
    getAllOrdersForAdmin();
    
    // Poll for new orders every 30 seconds
    const interval = setInterval(() => {
      getAllOrdersForAdmin();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "confirmed":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "inprocess":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "inshipping":
        return "bg-purple-500 hover:bg-purple-600 text-white";
      case "rejected":
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const filteredOrders = orderList?.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.addressInfo?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = {
    total: orderList?.length || 0,
    pending: orderList?.filter(o => o.orderStatus === 'pending').length || 0,
    processing: orderList?.filter(o => o.orderStatus === 'inProcess').length || 0,
    delivered: orderList?.filter(o => o.orderStatus === 'delivered').length || 0,
  };

  if (isLoading && !orderList?.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-green-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              Order Management
            </h1>
            <p className="text-muted-foreground mt-1">View and manage all customer orders</p>
          </div>
          <Button 
            onClick={() => getAllOrdersForAdmin()}
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-primary">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold text-primary">{stats.processing}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-primary">{stats.delivered}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by order ID or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-green-200"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white/50 border-green-200">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="inProcess">In Process</SelectItem>
              <SelectItem value="inShipping">In Shipping</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white/50 border-green-200">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-100">
        <CardHeader>
          <CardTitle className="text-primary">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile View */}
          <div className="block md:hidden space-y-4">
            {filteredOrders && filteredOrders.length > 0 ? (
              filteredOrders.map((orderItem) => (
                <Card key={orderItem._id} className="border-green-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-muted-foreground">Order ID</p>
                        <p className="font-mono font-semibold text-sm">{orderItem._id.slice(-8)}</p>
                      </div>
                      <Badge className={getStatusColor(orderItem.orderStatus)}>
                        {orderItem.orderStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm">{new Date(orderItem.orderDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-bold text-green-600">₹{orderItem.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleFetchOrderDetails(orderItem._id)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No orders found</p>
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-50 hover:bg-green-50">
                  <TableHead className="font-bold">Order ID</TableHead>
                  <TableHead className="font-bold">Date</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Payment</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders && filteredOrders.length > 0 ? (
                  filteredOrders.map((orderItem) => (
                    <TableRow key={orderItem._id} className="hover:bg-green-50/50">
                      <TableCell className="font-mono text-sm">{orderItem._id.slice(-8)}</TableCell>
                      <TableCell>{new Date(orderItem.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(orderItem.orderStatus)}>
                          {orderItem.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={orderItem.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                          {orderItem.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        ₹{orderItem.totalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleFetchOrderDetails(orderItem._id)}
                          variant="outline"
                          size="sm"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No orders found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onOpenChange={() => {
          setOpenDetailsDialog(false);
          resetOrderDetails();
        }}
      >
        <AdminOrderDetailsView 
          orderDetails={orderDetails} 
          onUpdateStatus={handleUpdateStatus}
          onRefresh={() => getAllOrdersForAdmin()}
        />
      </Dialog>
    </div>
  );
};

export default AdminOrders;