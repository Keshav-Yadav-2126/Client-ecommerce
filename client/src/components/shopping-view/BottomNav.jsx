import React from "react";
import { NavLink } from "react-router-dom";
import { Home, ShoppingCart, Store, ClipboardList } from "lucide-react";

const BottomNav = ({ setOpenCartSheet }) => {
  const navItems = [
    { name: "Home", path: "/shop/home", icon: Home },
    { name: "Cart", action: () => setOpenCartSheet(true), icon: ShoppingCart },
    { name: "Shop", path: "/shop/listing", icon: Store },
    { name: "Orders", path: "/shop/account", icon: ClipboardList },
  ];

  return (
    <div className="fixed bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md border-t border-yellow-200 md:hidden z-50 shadow-lg rounded-2xl">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => (
          item.path ? (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-yellow-600 bg-yellow-50 shadow-md scale-105"
                    : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 hover:scale-105"
                }`
              }
            >
              <item.icon size={24} className="mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </NavLink>
          ) : (
            <button
              key={item.name}
              onClick={item.action}
              className="flex flex-col items-center p-2 rounded-xl transition-all duration-300 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 hover:scale-105"
            >
              <item.icon size={24} className="mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          )
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
