import "./App.css";
import { Routes, Route } from "react-router-dom";
import Authlayout from "./components/auth/Layout";
import RefundRequestRoute from "./pages/shopping-view/RefundRequestRoute.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import AdminDashboard from "./pages/admin-view/Dashboard";
import AdminProducts from "./pages/admin-view/Products";
import AdminOrders from "./pages/admin-view/Orders";
import AdminRefunds from "./pages/admin-view/Refunds";
import AdminLayout from "./components/admin-view/Layout";
import ShoppingHome from "./pages/shopping-view/Home";
import ShoppingCheckout from "./pages/shopping-view/Checkout";
import ShoppingAccount from "./pages/shopping-view/Account";
import ShoppingListing from "./pages/shopping-view/Listing";
import ProductDetails from "./pages/shopping-view/ProductDetails";
import CheckAuth from "./components/common/check-auth";
import useAuthStore from "./store/auth-slice/auth-store";
import { useEffect } from "react";
import ShoppingLayout from "./components/shopping-view/Layout";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/Search";
import { NotificationProvider } from "./contexts/NotificationProvider";
import AdminFeatures from "./pages/admin-view/Features";

function App() {
  const auth = useAuthStore();

  useEffect(() => {
    auth.authChecker();
  }, []);

  if (auth.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-yellow-600 font-medium">Loading Pachory...</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-yellow-50 to-orange-50">
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth
                isAuthenticated={auth.isAuthenticated}
                user={auth.user}
              ></CheckAuth>
            }
          />
          <Route
            path="/auth"
            element={
              <CheckAuth
                isAuthenticated={auth.isAuthenticated}
                user={auth.user}
              >
                <Authlayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route
            path="/admin"
            element={
              <CheckAuth
                isAuthenticated={auth.isAuthenticated}
                user={auth.user}
              >
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="refunds" element={<AdminRefunds />} />
            <Route path="features" element={<AdminFeatures/>}/>
          </Route>
          <Route
            path="/shop"
            element={
              <CheckAuth
                isAuthenticated={auth.isAuthenticated}
                user={auth.user}
              >
                <ShoppingLayout />
              </CheckAuth>
            }
          >
            <Route path="home" element={<ShoppingHome />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="search" element={<SearchProducts />} />
            <Route path="refund-request" element={<RefundRequestRoute />} />
          </Route>
        </Routes>
      </div>
    </NotificationProvider>
  );
}

export default App;
