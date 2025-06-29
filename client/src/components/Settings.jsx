import React from 'react';
import { useWallet } from '../context/WalletContext';
import { ArrowLeft } from 'lucide-react';

export default function Settings() {
  const { layoutMode, setLayoutMode, setView } = useWallet();

  const toggleLayoutMode = () => {
    if (layoutMode === 'desktop') {
      setLayoutMode('mobile');
      setView('dashboard');
    } else {
      setLayoutMode('desktop');
      setView('dashboard');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setView('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Layout Mode</h3>
        <button
          onClick={toggleLayoutMode}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Switch to {layoutMode === 'desktop' ? 'Mobile' : 'Desktop'} View
        </button>
      </div>
    </div>
  );
}
