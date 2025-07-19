import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Send, Download, Clock, User, Plus } from 'lucide-react';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home', path: '/dashboard' },
    { id: 'add-money', icon: Plus, label: 'Add', path: '/add-money' },
    { id: 'send', icon: Send, label: 'Send', path: '/send' },
    { id: 'receive', icon: Download, label: 'Receive', path: '/receive' },
    { id: 'history', icon: Clock, label: 'History', path: '/history' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
  ];

  return (
    <div className="bg-white border-t border-gray-200 px-2 py-2">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center space-y-1 py-2 px-2 rounded-lg transition-all duration-200 ${
              currentPath === item.path
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentPath === item.path ? 'text-blue-600' : 'text-gray-600'}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}