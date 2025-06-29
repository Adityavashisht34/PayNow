import React from 'react';
import { useWallet } from '../context/WalletContext';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import NotificationSystem from './NotificationSystem';
import { 
  Home, 
  Send, 
  Download, 
  Clock, 
  User, 
  LogOut,
  Bell,
  Settings
} from 'lucide-react';

export default function DesktopLayout() {
  const { user, logout, setLayoutMode } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
    { id: 'send', icon: Send, label: 'Send Money', path: '/send' },
    { id: 'receive', icon: Download, label: 'Receive Money', path: '/receive' },
    { id: 'history', icon: Clock, label: 'Transaction History', path: '/history' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
  ];

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">PayWallet</h1>
              <p className="text-sm text-gray-500">Digital Payments</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentPath === item.path
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    currentPath === item.path ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="font-medium">Settings</span>
            </button>
            <button
              onClick={() => {
                if (user.layoutMode === 'desktop') {
                  setLayoutMode('mobile');
                } else {
                  setLayoutMode('desktop');
                }
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <span className="font-medium">Toggle Mobile/Desktop View</span>
            </button>
            <button 
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">
                {currentPath === '/dashboard' ? 'Dashboard' : currentPath.replace('/', '')}
              </h2>
              <p className="text-gray-600">
                {currentPath === '/dashboard' && 'Overview of your financial activity'}
                {currentPath === '/send' && 'Transfer money to contacts'}
                {currentPath === '/receive' && 'Request payments from others'}
                {currentPath === '/history' && 'View all your transactions'}
                {currentPath === '/profile' && 'Manage your account settings'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      <NotificationSystem />
    </div>
  );
}
