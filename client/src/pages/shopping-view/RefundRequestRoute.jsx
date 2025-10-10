import React from "react";
import RefundRequestPage from "./RefundRequest";
import { useLocation } from "react-router-dom";

const RefundRequestRoute = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get("orderId");
  if (!orderId) return <div className="p-8 text-center">Order ID missing</div>;
  return <RefundRequestPage orderId={orderId} />;
};

export default RefundRequestRoute;
