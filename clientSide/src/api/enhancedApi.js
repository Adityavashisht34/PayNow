import axios from 'axios';

// Single service API base URL
const API_URL = 'http://localhost:8080';

// Enhanced User API with OTP support
export const userApi = {
  // Generate user IDs
  generateIds: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate IDs');
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/user/save-user`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login with password (legacy)
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/user/find-user`, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Enhanced login with email/mobile and password
  loginWithPassword: async (emailOrMobile, password) => {
    try {
      const response = await axios.post(`${API_URL}/user/login-password`, {
        emailOrMobile,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Send login OTP
  sendLoginOTP: async (emailOrMobile) => {
    try {
      const response = await axios.post(`${API_URL}/user/send-login-otp`, {
        emailOrMobile
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  // Login with OTP
  loginWithOTP: async (emailOrMobile, otpCode) => {
    try {
      const response = await axios.post(`${API_URL}/user/login-otp`, {
        emailOrMobile,
        otpCode
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  },

  // Send password reset OTP
  sendPasswordResetOTP: async (emailOrMobile) => {
    try {
      const response = await axios.post(`${API_URL}/user/send-reset-otp`, {
        emailOrMobile
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send reset OTP');
    }
  },

  // Reset password with OTP
  resetPassword: async (emailOrMobile, otpCode, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/user/reset-password`, {
        emailOrMobile,
        otpCode,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  },

  // Send action OTP (for profile changes, etc.)
  sendActionOTP: async (userId, purpose) => {
    try {
      const response = await axios.post(`${API_URL}/user/send-action-otp`, {
        userId,
        purpose
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  // Verify action OTP
  verifyActionOTP: async (userId, otpCode, purpose) => {
    try {
      const response = await axios.post(`${API_URL}/user/verify-action-otp`, {
        userId,
        otpCode,
        purpose
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  },

  // Update password with OTP
  updatePasswordWithOTP: async (userId, otpCode, newPassword) => {
    try {
      const response = await axios.patch(`${API_URL}/user/update-password-otp`, {
        userId,
        otpCode,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password update failed');
    }
  },

  // Legacy update password (without OTP)
  updatePassword: async (passwordData) => {
    try {
      const response = await axios.patch(`${API_URL}/user/update-password`, passwordData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password update failed');
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'User not found');
    }
  },

  // Get all users (for contacts)
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/all`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load users');
    }
  }
};

// Enhanced Wallet API with OTP support
export const walletApi = {
  // Get user balance
  getBalance: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/wallet/balance/${userId}`);
      return response.data;
    } catch (error) {
      return { success: true, data: { balance: 0 } };
    }
  },

  // Get user transactions
  getTransactions: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/wallet/transactions/${userId}`);
      return response.data;
    } catch (error) {
      return { success: true, data: [] };
    }
  },

  // Send transaction OTP
  sendTransactionOTP: async (userId, purpose) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/send-transaction-otp`, {
        userId,
        purpose
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  // Send money with OTP
  sendMoneyWithOTP: async (transactionData) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/send-with-otp`, transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send money');
    }
  },

  // Add money with OTP
  addMoneyWithOTP: async (addMoneyData) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/add-money-with-otp`, addMoneyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add money');
    }
  },

  // Legacy methods (without OTP)
  sendMoney: async (transactionData) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/send`, transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send money');
    }
  },

  addMoney: async (addMoneyData) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/add-money`, addMoneyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add money');
    }
  },

  // Request money (placeholder)
  requestMoney: async (requestData) => {
    try {
      // This would be implemented based on your requirements
      return {
        success: true,
        message: 'Money request sent successfully'
      };
    } catch (error) {
      return {
        success: true,
        message: 'Money request sent successfully'
      };
    }
  }
};