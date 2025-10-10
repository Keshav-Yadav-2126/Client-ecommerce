// pages/admin-view/Refunds.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  RefreshCw, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  Clock,
  DollarSign,
  Package,
  User,
  Image as ImageIcon
} from 'lucide-react';
import useAdminRefundStore from '@/store/admin/refund-store';

const AdminRefunds = () => {
  const { refundRequests, fetchAllRefundRequests, updateRefundStatus, isLoading } = useAdminRefundStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAllRefundRequests().finally(() => setLoading(false));
  }, [fetchAllRefundRequests]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStatusUpdate = async (refundId, newStatus) => {
    await updateRefundStatus(refundId, newStatus);
    fetchAllRefundRequests();
  };

  const filteredRefunds = refundRequests.filter(refund => {
    const matchesSearch = (refund.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (refund.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (refund._id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: refundRequests.length,
    pending: refundRequests.filter(r => r.status === 'pending').length,
    approved: refundRequests.filter(r => r.status === 'approved').length,
    rejected: refundRequests.filter(r => r.status === 'rejected').length,
  };

  if (loading || isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 min-h-screen">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-green-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
                Refund Management
              </h1>
              <p className="text-muted-foreground mt-1">Process and manage customer refund requests</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Refunds</p>
                  <p className="text-2xl font-bold text-primary">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600" />
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
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-primary">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-primary">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by customer name, order ID, or refund ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-green-200"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/50 border-green-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Refunds Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardHeader>
            <CardTitle className="text-primary">Refund Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRefunds.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No refund requests found</p>
                </div>
              ) : (
                filteredRefunds.map((refund) => (
                  <Card key={refund._id} className="border-green-100">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3 className="font-semibold text-primary">Refund #{refund._id}</h3>
                            <Badge className={getStatusColor(refund.status)}>
                              {refund.status?.charAt(0).toUpperCase() + refund.status?.slice(1)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{refund.user?.name}</span>
                              <span className="text-muted-foreground">({refund.user?.email})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span>Order #{refund.orderId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">₹{refund.amount}</span>
                            </div>
                            <div className="text-muted-foreground">
                              Requested: {refund.createdAt ? new Date(refund.createdAt).toLocaleDateString() : ''}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            {refund.productImage && (
                              <a href={refund.productImage} target="_blank" rel="noopener noreferrer">
                                <img src={refund.productImage} alt="Product" className="w-20 h-20 object-cover rounded border" />
                              </a>
                            )}
                          </div>
                          <div>
                            <p className="text-sm"><strong>Reason:</strong> {refund.reason}</p>
                            {refund.processedDate && (
                              <p className="text-sm"><strong>Processed:</strong> {new Date(refund.processedDate).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          {refund.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => handleStatusUpdate(refund._id, 'approved')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                                disabled={isLoading}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleStatusUpdate(refund._id, 'rejected')}
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-50"
                                size="sm"
                                disabled={isLoading}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRefunds;