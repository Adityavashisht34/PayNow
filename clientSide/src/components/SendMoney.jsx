import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatCurrency } from '../utils/formatters';
import { ArrowLeft, Send, Search, Star, User, RefreshCw, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isValidAmount } from '../utils/simpleValidation';
import { walletApi } from '../api/enhancedApi';
import OTPModal from './OTPModal';

export default function SendMoney() {
  const { balance, contacts, user, addNotification, loadContacts, loadUserData } = useWallet();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Select Contact, 2: Enter Amount, 3: Confirm
  const [selectedContact, setSelectedContact] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [refreshingContacts, setRefreshingContacts] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Load contacts when component mounts
  useEffect(() => {
    loadContacts();
  }, []);

  const refreshContacts = async () => {
    setRefreshingContacts(true);
    await loadContacts();
    setRefreshingContacts(false);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteContacts = filteredContacts.filter(contact => contact.favorite);
  const otherContacts = filteredContacts.filter(contact => !contact.favorite);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      // Clear error when user types
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: '' }));
      }
    }
  };

  const quickAmounts = [25, 50, 100, 200];

  const validateAmount = () => {
    const validation = isValidAmount(amount, balance);
    if (!validation.valid) {
      setErrors({ amount: validation.message });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSendMoney = async () => {
    if (!validateAmount()) return;

    setLoading(true);
    
    try {
      // Send OTP for transaction
      const otpResponse = await walletApi.sendTransactionOTP(user.id, 'TRANSACTION');
      
      if (otpResponse.success) {
        setShowOTPModal(true);
        addNotification({
          id: Date.now().toString(),
          type: 'info',
          message: 'OTP sent to your email and mobile number',
          timestamp: new Date()
        });
      } else {
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          message: 'Failed to send OTP. Please try again.',
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: error.message || 'Failed to send OTP',
        timestamp: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otpCode) => {
    setOtpLoading(true);
    
    try {
      const response = await walletApi.sendMoneyWithOTP({
        fromUserId: user.id,
        toUserEmail: selectedContact.email,
        amount: parseFloat(amount),
        description: description || 'Money transfer',
        otpCode: otpCode
      });
      
      if (response.success) {
        setShowOTPModal(false);
        
        // Reload user data to get updated balance
        await loadUserData();
        
        addNotification({
          id: Date.now().toString(),
          type: 'success',
          message: `Successfully sent ₹${amount} to ${selectedContact.name}`,
          timestamp: new Date()
        });
        
        // Reset form and navigate
        setStep(1);
        setSelectedContact(null);
        setAmount('');
        setDescription('');
        navigate('/dashboard');
      } else {
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          message: response.message || 'Transaction failed',
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Send money error:', error);
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: error.message || 'Transaction failed. Please try again.',
        timestamp: new Date()
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    return walletApi.sendTransactionOTP(user.id, 'TRANSACTION');
  };

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Send Money</h2>
          <button
            onClick={refreshContacts}
            disabled={refreshingContacts}
            className="ml-auto p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-blue-600 ${refreshingContacts ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {favoriteContacts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Favorites
            </h3>
            <div className="space-y-3">
              {favoriteContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    setStep(2);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={contact.avatar} 
                      alt={contact.name} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {favoriteContacts.length > 0 ? 'All Contacts' : 'Contacts'}
          </h3>
          <div className="space-y-3">
            {otherContacts.length === 0 && favoriteContacts.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No contacts found</p>
                <p className="text-sm text-gray-400">
                  {searchTerm ? 'Try a different search term' : 'Register more users to see them here'}
                </p>
                <button
                  onClick={refreshContacts}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh Contacts
                </button>
              </div>
            ) : (
              otherContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    setStep(2);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={contact.avatar} 
                      alt={contact.name} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setStep(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Enter Amount</h2>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <img 
              src={selectedContact.avatar} 
              alt={selectedContact.name} 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">{selectedContact.name}</p>
              <p className="text-sm text-gray-500">{selectedContact.email}</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">₹</span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl text-center ${
                errors.amount ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          <p className="text-sm text-gray-500 mt-2">
            Available balance: {formatCurrency(balance)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick amounts</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                ₹{quickAmount}
              </button>
            ))}
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
            placeholder="What's this for?"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* OTP Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Secure Transaction</h4>
              <p className="text-sm text-blue-700">
                For your security, we'll send an OTP to verify this transaction.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (validateAmount()) {
              setStep(3);
            }
          }}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setStep(2)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Confirm Transfer</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="text-center">
          <img 
            src={selectedContact.avatar} 
            alt={selectedContact.name} 
            className="w-16 h-16 rounded-full mx-auto mb-3"
          />
          <h3 className="text-xl font-semibold text-gray-800">{selectedContact.name}</h3>
          <p className="text-gray-500">{selectedContact.email}</p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Amount</span>
            <span className="text-2xl font-bold text-gray-800">{formatCurrency(parseFloat(amount))}</span>
          </div>
          
          {description && (
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Description</span>
              <span className="text-gray-800">{description}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">New Balance</span>
            <span className="text-gray-800 font-semibold">
              {formatCurrency(balance - parseFloat(amount))}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSendMoney}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Send Money with OTP</span>
          </>
        )}
      </button>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerify}
        onResend={handleResendOTP}
        title="Verify Money Transfer"
        description={`Enter the OTP sent to your email and mobile to send ₹${amount} to ${selectedContact?.name}`}
        loading={otpLoading}
      />
    </div>
  );
}