import React from 'react'
import { Button } from '../ui/button';
import { AlignJustify, LogOut, Bell, Settings } from 'lucide-react';
import useAuthStore from '@/store/auth-slice/auth-store';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({setOpen}) => {
  const {logoutUser, user} = useAuthStore();
  const navigate = useNavigate()
  
  function handleLogout() {
    logoutUser();
    navigate("/auth/login", {replace: true})
  }
  
  return (
    <header className='flex items-center justify-between px-4 lg:px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-green-200 shadow-sm'>
      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={()=>setOpen(true)} 
          className="lg:hidden bg-green-100 hover:bg-green-200 text-green-700 border-green-300"
          variant="outline"
          size="icon"
        >
          <AlignJustify className="h-5 w-5" />
          <span className='sr-only'>Toggle Menu</span>
        </Button>
        
        {/* Welcome Message - Hidden on mobile */}
        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-primary">
            Welcome back, {user?.name || 'Admin'}!
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your organic nutrition products
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className='flex items-center gap-2 lg:gap-3'>
        {/* Notifications */}
        <Button 
          variant="outline" 
          size="icon"
          className="border-green-300 text-green-700 hover:bg-green-100 relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>
        
        {/* Settings */}
        <Button 
          variant="outline" 
          size="icon"
          className="border-green-300 text-green-700 hover:bg-green-100 hidden sm:flex"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        {/* Logout Button */}
        <Button 
          onClick={handleLogout} 
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-sm"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader
