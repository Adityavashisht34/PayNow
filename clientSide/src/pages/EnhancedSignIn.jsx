import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Smartphone, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../api/enhancedApi';
import { useWallet } from '../context/WalletContext';
import OTPModal from '../components/OTPModal';

export default function EnhancedSignIn() {
  const { login } = useWallet();
  const navigate = useNavigate();
  
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [formData, setFormData] = useState({ emailOrMobile: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.emailOrMobile || !formData.password) {
      setErrors({ 
        emailOrMobile: !formData.emailOrMobile ? 'Email or mobile is required' : '',
        password: !formData.password ? 'Password is required' : ''
      });
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.loginWithPassword(formData.emailOrMobile, formData.password);
      
      if (response.success && response.data) {
        const success = await login(response.data.email, formData.password);
        if (success) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setErrors({ password: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.emailOrMobile) {
      setErrors({ emailOrMobile: 'Email or mobile is required' });
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.sendLoginOTP(formData.emailOrMobile);
      
      if (response.success) {
        setShowOTPModal(true);
      } else {
        setErrors({ emailOrMobile: 'Failed to send OTP' });
      }
    } catch (error) {
      setErrors({ emailOrMobile: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otpCode) => {
    setOtpLoading(true);

    try {
      const response = await userApi.loginWithOTP(formData.emailOrMobile, otpCode);
      
      if (response.success && response.data) {
        // For OTP login, we'll use a special login method
        const userData = {
          id: response.data.userId,
          name: `${response.data.firstName} ${response.data.lastName}`,
          email: response.data.email,
          phone: response.data.mobile || '+1 234 567 8900',
          avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          isAuthenticated: true
        };
        
        // Store user data directly
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update context
        const success = await login(response.data.email, 'otp-login');
        if (success) {
          setShowOTPModal(false);
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setErrors({ otp: error.message });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    return userApi.sendLoginOTP(formData.emailOrMobile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 p-4">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access your PayWallet</p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setLoginMethod('password')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              loginMethod === 'password' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Password</span>
          </button>
          <button
            onClick={() => setLoginMethod('otp')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              loginMethod === 'otp' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">OTP</span>
          </button>
        </div>

        <form onSubmit={loginMethod === 'password' ? handlePasswordLogin : handleOTPLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address or Mobile Number
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="emailOrMobile"
                type="text"
                value={formData.emailOrMobile}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.emailOrMobile ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="john.doe@example.com or 1234567890"
              />
            </div>
            {errors.emailOrMobile && <p className="text-red-500 text-sm mt-1">{errors.emailOrMobile}</p>}
          </div>

          {loginMethod === 'password' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>{loginMethod === 'password' ? 'Sign In' : 'Send OTP'}</span>
                {loginMethod === 'password' ? <ArrowRight className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
              </>
            )}
          </button>
        </form>

        {loginMethod === 'password' && (
          <div className="text-center mt-4">
            <Link 
              to="/forgot-password" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Forgot Password?
            </Link>
          </div>
        )}

        <p className="text-sm text-center mt-6 text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700">Sign Up</Link>
        </p>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">Demo: john.doe@example.com / password123</p>
        </div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerify}
        onResend={handleResendOTP}
        title="Login Verification"
        description={`Enter the OTP sent to ${formData.emailOrMobile}`}
        loading={otpLoading}
      />
    </div>
  );
}