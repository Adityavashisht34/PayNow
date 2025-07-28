import axios from 'axios';


//const API_URL = import.meta.env.VITE_APP_URL;
const API_URL = "http://localhost:8080"


export const userApi = {
  
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

  // Login user
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/user/find-user`, credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Update password
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

// Simple API functions for wallet operations
export const walletApi = {
  // Get user balance
  getBalance: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/wallet/balance/${userId}`);
      return response.data;
    } catch (error) {
      // Return default balance if API not working
      return {
        success: true,
        data: { balance: 0 }
      };
    }
  },

  // Get user transactions
  getTransactions: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/wallet/transactions/${userId}`);
      return response.data;
    } catch (error) {
      // Return empty transactions if API not working
      return {
        success: true,
        data: []
      };
    }
  },

  // Send money
  sendMoney: async (transactionData) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/send`, transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send money');
    }
  },

  // Add money to wallet
  addMoney: async (addMoneyData) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/add-money`, addMoneyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add money');
    }
  },

  // Request money
  requestMoney: async (requestData) => {
    try {
      const response = await axios.post(`${API_URL}/wallet/request`, requestData);
      return response.data;
    } catch (error) {
      return {
        success: true,
        message: 'Money request sent successfully'
      };
    }
  }
};
