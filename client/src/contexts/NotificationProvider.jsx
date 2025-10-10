import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Notification sound
  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play failed:', err));
  };

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to notification server');
      // Join admin room
      newSocket.emit('join-admin');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from notification server');
    });

    // Listen for new orders
    newSocket.on('new-order', (data) => {
      console.log('New order received:', data);
      
      // Play notification sound
      playNotificationSound();
      
      // Add to notifications list
      const notification = {
        id: Date.now(),
        type: 'new-order',
        ...data,
        read: false,
      };
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast.success(
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-bold">New Order Received!</p>
            <p className="text-sm">Order #{data.orderNumber} - ₹{data.totalAmount.toFixed(2)}</p>
          </div>
        </div>,
        {
          duration: 5000,
          position: 'top-right',
        }
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    socket,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};