import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Shield, 
  CreditCard,
  LogOut,
  Edit2,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/simpleApi';
import { isValidPassword } from '../utils/simpleValidation';

export default function Profile() {
  const { user, logout } = useWallet();
  const navigate = useNavigate();
  const [showPasswordChange, setPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!isValidPassword(newPassword)) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.updatePassword({
        email: user.email,
        newPassword: newPassword
      });

      if (response.success) {
        alert("Password updated successfully");
        setPasswordChange(false);
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
      }
    } catch (error) {
      console.error("Password update failed:", error);
      alert(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const profileSections = [
    {
      title: 'Personal Information',
      icon: User,
      items: [
        { label: 'Full Name', value: user.name, icon: User },
        { label: 'Email', value: user.email, icon: Mail },
        { label: 'Phone', value: user.phone, icon: Phone }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Change Password', value: '••••', icon: Shield, action: () => setPasswordChange(true) },
      ]
    },
    {
      title: 'Preferences',
      icon: Settings,
      items: [
        { label: 'Currency', value: 'INR (₹)', icon: CreditCard },
        { label: 'Language', value: 'English', icon: Settings }
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
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white"
            />
            <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="text-2xl font-bold">{user.name}</h3>
            <p className="text-blue-100">{user.email}</p>
            <p className="text-blue-100">{user.phone}</p>
          </div>
        </div>
      </div>

      {profileSections.map((section, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <section.icon className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
          </div>

          <div className="space-y-3">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{item.value}</span>
                  {item.action && (
                    <button
                      onClick={item.action}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Simple Password Change Modal */}
      {showPasswordChange && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h3>
            <form onSubmit={changePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword) {
                        setErrors(prev => ({ ...prev, newPassword: '' }));
                      }
                    }}
                    placeholder="Min 6 characters"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.newPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }
                    }}
                    placeholder="Confirm Password"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordChange(false);
                    setNewPassword('');
                    setConfirmPassword('');
                    setErrors({});
                  }}
                  className="flex-1 bg-gray-100 text-gray-800 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-4 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2 border border-red-200"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
}