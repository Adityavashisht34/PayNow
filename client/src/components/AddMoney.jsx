import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatCurrency } from '../utils/formatters';
import { ArrowLeft, Plus, CreditCard, Banknote, Shield, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isValidAmount } from '../utils/simpleValidation';
import { walletApi } from '../api/enhancedApi';
import OTPModal from './OTPModal';

export default function AddMoney() {
  const { balance, user, loadUserData, addNotification } = useWallet();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

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

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const validateAmount = () => {
    const validation = isValidAmount(amount);
    if (!validation.valid) {
      setErrors({ amount: validation.message });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleAddMoney = async () => {
    if (!validateAmount()) return;

    setLoading(true);

    try {
      console.log('🚀 Sending OTP for add money...');
      console.log('User ID:', user.id);
      console.log('User Email:', user.email);
      console.log('User Phone:', user.phone);
      console.log('Purpose: ADD_MONEY');

      // Send OTP for add money transaction
      const otpResponse = await walletApi.sendTransactionOTP(user.id, 'ADD_MONEY');

      console.log('📧 OTP Response:', otpResponse);

      if (otpResponse.success) {
        setShowOTPModal(true);
        addNotification({
          id: Date.now().toString(),
          type: 'info',
          message: 'OTP sent to your email and mobile number. Check console for test OTP.',
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
      console.error('❌ Send OTP error:', error);
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
      console.log('🔐 Verifying OTP for add money...');
      console.log('User ID:', user.id);
      console.log('Amount:', parseFloat(amount));
      console.log('OTP Code:', otpCode);

      const response = await walletApi.addMoneyWithOTP({
        userId: user.id,
        amount: parseFloat(amount),
        description: description || 'Balance added',
        otpCode: otpCode
      });

      console.log('💰 Add Money Response:', response);

      if (response.success) {
        setShowOTPModal(false);

        // Reload user data to get updated balance
        await loadUserData();

        addNotification({
          id: Date.now().toString(),
          type: 'success',
          message: `Successfully added ₹${amount} to your wallet`,
          timestamp: new Date()
        });

        // Reset form and navigate
        setAmount('');
        setDescription('');
        navigate('/dashboard');
      } else {
        throw new Error(response.message || 'Failed to add money');
      }
    } catch (error) {
      console.error('❌ Add money error:', error);
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: error.message || 'Transaction failed. Please try again.',
        timestamp: new Date()
      });
      throw error; // Re-throw to trigger OTP modal error handling
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    console.log('🔄 Resending OTP...');
    return walletApi.sendTransactionOTP(user.id, 'ADD_MONEY');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Add Money</h2>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Plus className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Add Money to Wallet</h3>
            <p className="text-green-100">Current Balance: {formatCurrency(balance)}</p>
          </div>
        </div>
        <p className="text-green-100">Add money to your wallet to start making payments</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount to Add
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">₹</span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-2xl text-center ${
                errors.amount ? 'border-red-300' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick amounts</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-colors font-medium"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>

        <div className="space-y-3">
          <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">Demo Payment</p>
                <p className="text-sm text-gray-500">Instant credit for testing</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 opacity-50">
            <div className="flex items-center space-x-3">
              <Banknote className="w-6 h-6 text-gray-400" />
              <div>
                <p className="font-medium text-gray-600">Bank Transfer</p>
                <p className="text-sm text-gray-400">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Secure Transaction</h4>
            <p className="text-sm text-blue-700">
              For your security, we'll send an OTP to your registered email and mobile number to verify this transaction.
            </p>
          </div>
        </div>
      </div>

      {/* Testing Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Testing Mode</h4>
            <p className="text-sm text-amber-700">
              <strong>SMS Testing:</strong> Due to Twilio trial limitations, SMS can only be sent to verified numbers.
              For testing, use +15005550006 or check console logs for OTP codes.
            </p>
            <p className="text-sm text-amber-700 mt-1">
              <strong>Email Testing:</strong> OTPs are sent to real email addresses and also logged in console.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="bg-yellow-500 p-1 rounded-full mt-1">
            <span className="text-white text-xs">!</span>
          </div>
          <div>
            <h4 className="font-medium text-yellow-800">Demo Mode</h4>
            <p className="text-sm text-yellow-700">
              This is a demo application. Money added here is virtual and for testing purposes only.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleAddMoney}
        disabled={loading || !amount || parseFloat(amount) <= 0}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            <span>Add Money with OTP</span>
          </>
        )}
      </button>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerify}
        onResend={handleResendOTP}
        title="Verify Add Money Transaction"
        description={`Enter the OTP sent to your email and mobile to add ₹${amount} to your wallet`}
        loading={otpLoading}
      />
    </div>
  );
}