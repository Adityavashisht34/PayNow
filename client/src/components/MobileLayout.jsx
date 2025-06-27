import React from 'react';
import { useWallet } from '../context/WalletContext';
import Dashboard from './Dashboard';
import SendMoney from './SendMoney';
import ReceiveMoney from './ReceiveMoney';
import TransactionHistory from './TransactionHistory';
import Profile from './Profile';
import BottomNavigation from './BottomNavigation';
import NotificationSystem from './NotificationSystem';

export default function MobileLayout() {
  const { currentView } = useWallet();

  const renderView = () => {
    switch (currentView) {
      case 'send':
        return <SendMoney />;
      case 'receive':
        return <ReceiveMoney />;
      case 'history':
        return <TransactionHistory />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-auto">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
          <div className="p-6 pb-20">
            {renderView()}
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