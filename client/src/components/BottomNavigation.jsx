import React from 'react';
import { useWallet } from '../context/WalletContext';
import { Home, Send, Download, Clock, User } from 'lucide-react';

export default function BottomNavigation() {
  const { currentView, setView } = useWallet();

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'send', icon: Send, label: 'Send' },
    { id: 'receive', icon: Download, label: 'Receive' },
    { id: 'history', icon: Clock, label: 'History' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <item.icon className={`w-6 h-6 ${currentView === item.id ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}