import React, { useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import NotificationSystem from './NotificationSystem';

export default function MobileLayout() {
  const { layoutMode, setLayoutMode, user, loadUserData } = useWallet();

  // Load user data when layout mounts (after refresh)
  useEffect(() => {
    if (user.isAuthenticated) {
      loadUserData();
    }
  }, [user.isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
          <div className="p-6 pb-20">
            <Outlet />
            <button
              onClick={() => setLayoutMode('desktop')}
              className="mt-4 w-full flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Switch to Desktop View
            </button>
          </div>
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md">
            <BottomNavigation />
          </div>
        </div>
      </div>
      <NotificationSystem />
    </div>
  );
}