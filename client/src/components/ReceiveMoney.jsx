import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { ArrowLeft, QrCode, Copy, Check, Share } from 'lucide-react';

export default function ReceiveMoney() {
  const { user, setView } = useWallet();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);

  const paymentLink = `paywallet://pay?to=${user.id}&amount=${amount}&description=${encodeURIComponent(description)}`;
  const qrData = JSON.stringify({
    type: 'payment_request',
    recipient: user.name,
    userId: user.id,
    amount: parseFloat(amount) || 0,
    description: description || ''
  });

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sharePaymentRequest = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment Request',
          text: `${user.name} is requesting ${amount ? `$${amount}` : 'a payment'}${description ? ` for ${description}` : ''}`,
          url: paymentLink
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyToClipboard(paymentLink);
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
        <h2 className="text-2xl font-bold text-gray-800">Receive Money</h2>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-green-100">{user.phone}</p>
          </div>
        </div>
        <p className="text-green-100">Share your payment details to receive money instantly</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-xl"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this payment for?"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* QR Code Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          QR Code for Payment
        </h3>
        
        <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center mb-4">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <QrCode className="w-32 h-32 text-gray-800" />
            <p className="text-xs text-gray-500 mt-2 text-center">Scan to pay</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 text-center">
          Show this QR code to the person who wants to send you money
        </p>
      </div>

      {/* Payment Link Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Link</h3>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600 break-all font-mono">
            {paymentLink}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => copyToClipboard(paymentLink)}
            className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl transition-colors"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
          
          <button
            onClick={sharePaymentRequest}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors"
          >
            <Share className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Quick Share Options */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Share</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <button className="flex flex-col items-center space-y-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">📱</span>
            </div>
            <span className="text-sm font-medium text-gray-800">SMS</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">💬</span>
            </div>
            <span className="text-sm font-medium text-gray-800">WhatsApp</span>
          </button>
          
          <button className="flex flex-col items-center space-y-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">✉️</span>
            </div>
            <span className="text-sm font-medium text-gray-800">Email</span>
          </button>
        </div>
      </div>
    </div>
  );
}