import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

const CheckAuth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();

  console.log("CheckAuth Props:", location.pathname, isAuthenticated, user);
  
  // ✅ NEW: Always redirect "/" to "/shop/home" (no authentication required)
  if (location.pathname === "/") {
    return <Navigate to="/shop/home" />;
  }

  // ✅ NEW: Allow unauthenticated access to all /shop/* routes
  if (location.pathname.includes('/shop')) {
    return <>{children}</>;
  }

  // Unauthenticated users trying to access protected admin pages
  if (
    !isAuthenticated &&
    !(location.pathname.includes('/login') || location.pathname.includes('/register'))
  ) {
    return <Navigate to="/auth/login" />;
  }

  // Authenticated users landing on /login or /register
  if (
    isAuthenticated &&
    (location.pathname.includes('/login') || location.pathname.includes('/register'))
  ) {
    return user?.role === 'admin'
      ? <Navigate to="/admin/dashboard" />
      : <Navigate to="/shop/home" />;
  }

  // Non-admins trying to open /admin/*
  if (isAuthenticated && user?.role !== 'admin' && location.pathname.includes('/admin')) {
    return <Navigate to="/unauth-page" />;
  }

  // Admins trying to open /shop/* (commented out - allow admins to shop)
  // if (isAuthenticated && user?.role === 'admin' && location.pathname.includes('/shop')) {
  //   return <Navigate to="/admin/dashboard" />;
  // }

  return <>{children}</>;
};

export default CheckAuth;