import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./Header";
import AdminSidebar from "./Sidebar";
import { NotificationProvider } from "@/contexts/NotificationProvider";

const AdminLayout = () => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <NotificationProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
        {/* Admin Sidebar */}
        <AdminSidebar open={openSidebar} setOpen={setOpenSidebar} />
        <div className="flex flex-1 flex-col">
          {/* Admin Header */}
          <AdminHeader setOpen={setOpenSidebar} />
          <main className="flex-1 flex flex-col p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default AdminLayout;
