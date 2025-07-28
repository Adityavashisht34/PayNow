import React from 'react';
import { useWallet } from '../context/WalletContext';
import { ArrowLeft, Monitor, Smartphone, Globe, Bell, Shield, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { layoutMode, setLayoutMode } = useWallet();
  const navigate = useNavigate();

  const toggleLayoutMode = () => {
    if (layoutMode === 'desktop') {
      setLayoutMode('mobile');
    } else {
      setLayoutMode('desktop');
    }
  };

  const settingsSections = [
    {
      title: 'Preferences',
      icon: Globe,
      items: [
        {
          label: 'Language',
          value: 'English',
          description: 'Change app language'
        },
        {
          label: 'Currency',
          value: 'INR (₹)',
          description: 'Default currency for transactions'
        },
        {

        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Transaction Alerts',
          value: 'Enabled',
          description: 'Get notified for all transactions'
        },
        {
          label: 'Email Notifications',
          value: 'Enabled',
          description: 'Receive updates via email'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </div>

      {settingsSections.map((section, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <section.icon className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
          </div>
          
          <div className="space-y-4">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">{item.value}</span>
                      {item.action && (
                        <button 
                          onClick={item.action}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-3">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all text-left"
          >
            <h4 className="font-medium text-gray-800">Edit Profile</h4>
            <p className="text-sm text-gray-500">Update your personal information</p>
          </button>
          
          <button
            onClick={() => navigate('/history')}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all text-left"
          >
            <h4 className="font-medium text-gray-800">Transaction History</h4>
            <p className="text-sm text-gray-500">View all your transactions</p>
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">PayNow v1.0.0</h3>
        <p className="text-sm text-gray-500">
          Your secure digital payment solution
        </p>
      </div>
    </div>
  );
}