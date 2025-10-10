//sidebar.jsx
import { LayoutDashboard, ShoppingBasket, ShoppingCart, RefreshCw } from "lucide-react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const AdminSidebar = ({open, setOpen}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icons: <LayoutDashboard />,
      id: "dashboard",
    },
    {
      name: "Products",
      path: "/admin/products",
      icons: <ShoppingBasket />,
      id: "products",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icons: <ShoppingCart />,
      id: "orders",
    },
    {
      name: "Refunds",
      path: "/admin/refunds",
      icons: <RefreshCw />,
      id: "refunds",
    },
    {
      name: "Features",
      path: "/admin/features",
      icons: <LayoutDashboard />,
      id: "features",
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-gradient-to-b from-green-50 to-blue-50">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-green-200 pb-4">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <div>
                    <h1 className='text-lg font-extrabold text-primary'>Pachory</h1>
                    <p className='text-xs text-muted-foreground'>Admin Panel</p>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex-col flex gap-2">
              {menuItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <div
                    key={item.id}
                    onClick={() => {navigate(item.path), setOpen(false)}}
                    className={`flex text-xl items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
                      active 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' 
                        : 'text-muted-foreground hover:bg-white/70 hover:text-primary hover:shadow-sm'
                    }`}
                  >
                    <div className={`${active ? 'text-white' : 'text-primary'}`}>
                      {item.icons}
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className='hidden w-64 flex-col border-r bg-gradient-to-b from-green-50 to-blue-50 border-green-200 p-6 lg:flex'> 
        <div onClick={()=>navigate("/admin/dashboard")} className='flex items-center gap-3 cursor-pointer mb-8 p-3 rounded-lg hover:bg-white/50 transition-colors'>
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div>
            <h1 className='text-xl font-extrabold text-primary'>Pachory</h1>
            <p className='text-sm text-muted-foreground'>Admin Panel</p>
          </div>
        </div>
        <nav className='flex-col flex gap-2'>
          {menuItems.map((item)=>{
            const active = isActive(item.path);
            return (
              <div 
                key={item.id} 
                onClick={()=> navigate(item.path)} 
                className={`flex items-center gap-3 rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${
                  active 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' 
                    : 'text-muted-foreground hover:bg-white/70 hover:text-primary hover:shadow-sm'
                }`}
              >
                <div className={`${active ? 'text-white' : 'text-primary'}`}>
                  {item.icons}
                </div>
                <span className='text-sm font-medium'>{item.name}</span>
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;