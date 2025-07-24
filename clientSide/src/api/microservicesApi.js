import axios from 'axios';

// Microservices API URLs
const AUTH_SERVICE_URL = 'http://localhost:8082/auth';
const WALLET_SERVICE_URL = 'http://localhost:8080/wallet';
const NOTIFICATION_SERVICE_URL = 'http://localhost:8081/notification';

// Auth Service API
export const authApi = {
  // Generate user IDs
  generateIds: async () => {
    try {
      const response = await axios.get(`${AUTH_SERVICE_URL}/generate-ids`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate IDs');
    }
  },

  // Register new user
  register: async (userData) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login with password
  loginWithPassword: async (credentials) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/login-password`, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Send login OTP
  sendLoginOTP: async (emailOrMobile) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/send-login-otp`, { emailOrMobile });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  // Login with OTP
  loginWithOTP: async (emailOrMobile, otpCode) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/login-otp`, { emailOrMobile, otpCode });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  },

  // Send password reset OTP
  sendPasswordResetOTP: async (emailOrMobile) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/send-reset-otp`, { emailOrMobile });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send reset OTP');
    }
  },

  // Reset password with OTP
  resetPassword: async (emailOrMobile, otpCode, newPassword) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/reset-password`, {
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
      const response = await axios.post(`${AUTH_SERVICE_URL}/send-action-otp`, { userId, purpose });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  // Verify action OTP
  verifyActionOTP: async (userId, otpCode, purpose) => {
    try {
      const response = await axios.post(`${AUTH_SERVICE_URL}/verify-action-otp`, {
        userId,
        otpCode,
        purpose
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${AUTH_SERVICE_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'User not found');
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${AUTH_SERVICE_URL}/users`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load users');
    }
  }
};

// Wallet Service API
export const walletApi = {
  // Get user balance
  getBalance: async (userId) => {
    try {
      const response = await axios.get(`${WALLET_SERVICE_URL}/balance/${userId}`);
      return response.data;
    } catch (error) {
      return { success: true, data: { balance: 0 } };
    }
  },

  // Get user transactions
  getTransactions: async (userId) => {
    try {
      const response = await axios.get(`${WALLET_SERVICE_URL}/transactions/${userId}`);
      return response.data;
    } catch (error) {
      return { success: true, data: [] };
    }
  },

  // Send transaction OTP
  sendTransactionOTP: async (userId, purpose) => {
    try {
      const response = await axios.post(`${WALLET_SERVICE_URL}/send-transaction-otp`, {
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
      const response = await axios.post(`${WALLET_SERVICE_URL}/send-with-otp`, transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send money');
    }
  },

  // Add money with OTP
  addMoneyWithOTP: async (addMoneyData) => {
    try {
      const response = await axios.post(`${WALLET_SERVICE_URL}/add-money-with-otp`, addMoneyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add money');
    }
  },

  // Legacy methods (without OTP)
  sendMoney: async (transactionData) => {
    try {
      const response = await axios.post(`${WALLET_SERVICE_URL}/send`, transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send money');
    }
  },

  addMoney: async (addMoneyData) => {
    try {
      const response = await axios.post(`${WALLET_SERVICE_URL}/add-money`, addMoneyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add money');
    }
  }
};

// Notification Service API
export const notificationApi = {
  // Send OTP
  sendOTP: async (userId, email, mobile, purpose) => {
    try {
      const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/send-otp`, {
        userId,
        email,
        mobile,
        purpose
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  // Verify OTP
  verifyOTP: async (userId, otpCode, purpose) => {
    try {
      const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/verify-otp`, {
        userId,
        otpCode,
        purpose
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'OTP verification failed');
    }
  },

  // Send transaction notification
  sendTransactionNotification: async (email, mobile, message) => {
    try {
      const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/send-transaction-notification`, {
        email,
        mobile,
        message
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send notification');
    }
  }
};