import Address from '@/components/shopping-view/Address';
import ShoppingOrders from '../../components/shopping-view/Order';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import { Package, MapPin, User } from 'lucide-react';
import useAuthStore from '@/store/auth-slice/auth-store';

const ShoppingAccount = () => {
  const { user } = useAuthStore();

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-yellow-50/50 via-white to-orange-50/30'>
      {/* Hero Banner */}
      <div className='relative h-[180px] sm:h-[230px] md:h-[280px] lg:h-[320px] w-full overflow-hidden'>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/90 to-orange-600/90 z-10"></div>
        <img 
          src="https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg" 
          alt="Account Banner" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-3 sm:p-4 md:p-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-xl">
            <User className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 text-center">
            My Account
          </h1>
          <p className="text-xs sm:text-sm md:text-base opacity-90 text-center px-2">
            Welcome back, {user?.userName || user?.name}!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-7 md:py-10'>
        <div className='rounded-xl border border-yellow-200 sm:border-2 bg-white shadow-md sm:shadow-lg p-3 sm:p-5 md:p-6 lg:p-8'>
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-5 sm:mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-1 rounded-md sm:rounded-lg">
              <TabsTrigger 
                value="orders"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all duration-200 font-semibold text-xs sm:text-sm md:text-base py-2 sm:py-3"
              >
                <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">My Orders</span>
                <span className="sm:hidden">Orders</span>
              </TabsTrigger>
              <TabsTrigger 
                value="address"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-all duration-200 font-semibold text-xs sm:text-sm md:text-base py-2 sm:py-3"
              >
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">My Addresses</span>
                <span className="sm:hidden">Address</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders" className="mt-0">
              <ShoppingOrders />
            </TabsContent>
            
            <TabsContent value="address" className="mt-0">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ShoppingAccount;
