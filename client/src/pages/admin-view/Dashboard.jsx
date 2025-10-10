import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Package, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import useAdminOrderStore from '@/store/admin/order-store';
import useAdminProductsStore from '@/store/admin/product-store';

const AdminDashboard = () => {
  const { orderList, getAllOrdersForAdmin } = useAdminOrderStore();
  const { productList, fetchAllProduct } = useAdminProductsStore();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    deliveredOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  });

  useEffect(() => {
    getAllOrdersForAdmin();
    fetchAllProduct();  
  }, []);

  useEffect(() => {
    if (orderList && productList) {
      const totalOrders = orderList.length;
      const pendingOrders = orderList.filter(o => o.orderStatus === 'pending').length;
      const deliveredOrders = orderList.filter(o => o.orderStatus === 'delivered').length;
      const totalRevenue = orderList
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.totalAmount, 0);
      const lowStockProducts = productList.filter(p => p.stock < 10).length;

      setStats({
        totalOrders,
        pendingOrders,
        totalRevenue,
        deliveredOrders,
        totalProducts: productList.length,
        lowStockProducts,
      });
    }
  }, [orderList, productList]);

  // Order status distribution
  const orderStatusData = [
    { name: 'Pending', value: orderList?.filter(o => o.orderStatus === 'pending').length || 0, color: '#F59E0B' },
    { name: 'Processing', value: orderList?.filter(o => o.orderStatus === 'inProcess').length || 0, color: '#3B82F6' },
    { name: 'Shipped', value: orderList?.filter(o => o.orderStatus === 'inShipping').length || 0, color: '#8B5CF6' },
    { name: 'Delivered', value: orderList?.filter(o => o.orderStatus === 'delivered').length || 0, color: '#10B981' },
    { name: 'Rejected', value: orderList?.filter(o => o.orderStatus === 'rejected').length || 0, color: '#EF4444' },
  ];

  // Top selling products
  const productSalesData = {};
  orderList?.forEach(order => {
    order.cartItems.forEach(item => {
      if (!productSalesData[item.title]) {
        productSalesData[item.title] = 0;
      }
      productSalesData[item.title] += item.quantity;
    });
  });

  const topProducts = Object.entries(productSalesData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, quantity]) => ({ name, quantity }));

  // Revenue over time (last 7 days)
  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    const dayRevenue = orderList?.filter(order => {
      const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
      return orderDate === dateStr && order.paymentStatus === 'paid';
    }).reduce((sum, order) => sum + order.totalAmount, 0) || 0;

    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dayRevenue,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">Monitor your store performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-green-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats.totalOrders}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  All time
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats.pendingOrders}</p>
                <p className="text-xs text-yellow-600 mt-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Needs attention
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-primary mt-2">₹{stats.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Paid orders
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-green-100 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats.totalProducts}</p>
                <p className="text-xs text-red-600 mt-1 flex items-center">
                  <Package className="w-3 h-3 mr-1" />
                  {stats.lowStockProducts} low stock
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardHeader>
            <CardTitle className="text-primary">Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardHeader>
            <CardTitle className="text-primary">Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-100">
        <CardHeader>
          <CardTitle className="text-primary">Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="bg-white/80 backdrop-blur-sm border-green-100">
        <CardHeader>
          <CardTitle className="text-primary">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orderList?.slice(0, 5).map((order) => (
              <div key={order._id} className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    order.orderStatus === 'delivered' ? 'bg-green-100' :
                    order.orderStatus === 'pending' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    {order.orderStatus === 'delivered' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : order.orderStatus === 'rejected' ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Order #{order._id.slice(-8)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{order.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground capitalize">{order.orderStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;