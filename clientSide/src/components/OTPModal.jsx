import React, { useState, useEffect } from 'react';
import { Shield, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

export default function OTPModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  onResend, 
  title = "Enter OTP", 
  description = "Please enter the OTP sent to your registered email and mobile number",
  loading = false 
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(300);
      setError('');
      
      // Focus first input
      setTimeout(() => {
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(''); // Clear error when user types

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        // Clear the previous input
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setError('');
      
      // Focus last input
      const lastInput = document.getElementById('otp-5');
      if (lastInput) lastInput.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      try {
        setError('');
        await onVerify(otpCode);
      } catch (error) {
        setError('Invalid OTP. Please try again.');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
      }
    } else {
      setError('Please enter all 6 digits');
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await onResend();
      setTimeLeft(300); // Reset timer
      setOtp(['', '', '', '', '', '']); // Clear OTP
      setError('');
      
      // Focus first input
      const firstInput = document.getElementById('otp-0');
      if (firstInput) firstInput.focus();
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        <div className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter 6-digit OTP
            </label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  maxLength={1}
                  autoComplete="off"
                />
              ))}
            </div>
            {error && (
              <div className="flex items-center justify-center space-x-2 mt-3">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {timeLeft > 0 ? `OTP expires in ${formatTime(timeLeft)}` : 'OTP expired'}
              </span>
            </div>
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={resendLoading || timeLeft > 240} // Allow resend after 1 minute
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>
                {timeLeft > 240 ? `Resend in ${formatTime(timeLeft - 240)}` : 'Resend OTP'}
              </span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <span>Verify OTP</span>
              )}
            </button>
          </div>
        </div>

        {/* Testing Info */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Testing Information</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Check browser console for OTP codes</li>
            <li>• OTP is valid for 5 minutes</li>
            <li>• You can paste 6-digit codes directly</li>
            <li>• Real OTPs sent to email/SMS if configured</li>
          </ul>
        </div>
      </div>
    </div>
  );
}