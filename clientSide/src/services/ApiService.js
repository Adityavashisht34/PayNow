/**
 * Centralized API Service with proper encapsulation
 * Hides implementation details and provides a clean interface
 */
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8080';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Private method to make HTTP requests
   * @private
   */
  async _makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Request failed: ${endpoint}`, error);
      throw new Error(error.message || 'Network request failed');
    }
  }

  /**
   * Private method for GET requests
   * @private
   */
  async _get(endpoint) {
    return this._makeRequest(endpoint, { method: 'GET' });
  }

  /**
   * Private method for POST requests
   * @private
   */
  async _post(endpoint, data) {
    return this._makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Private method for PATCH requests
   * @private
   */
  async _patch(endpoint, data) {
    return this._makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // User Management Methods
  async generateUserIds() {
    const response = await this._get('/user/');
    return response.data;
  }

  async registerUser(userData) {
    const response = await this._post('/user/save-user', userData);
    return response.data;
  }

  async loginWithPassword(emailOrMobile, password) {
    const response = await this._post('/user/login-password', {
      emailOrMobile,
      password
    });
    return response.data;
  }

  async sendLoginOTP(emailOrMobile) {
    const response = await this._post('/user/send-login-otp', {
      emailOrMobile
    });
    return response;
  }

  async verifyLoginOTP(emailOrMobile, otpCode) {
    const response = await this._post('/user/login-otp', {
      emailOrMobile,
      otpCode
    });
    return response.data;
  }

  async sendPasswordResetOTP(emailOrMobile) {
    const response = await this._post('/user/send-reset-otp', {
      emailOrMobile
    });
    return response;
  }

  async resetPassword(emailOrMobile, otpCode, newPassword) {
    const response = await this._post('/user/reset-password', {
      emailOrMobile,
      otpCode,
      newPassword
    });
    return response;
  }

  async getUserById(userId) {
    const response = await this._get(`/user/${userId}`);
    return response.data;
  }

  async getAllUsers() {
    const response = await this._get('/user/all');
    return response.data;
  }

  async updatePassword(passwordData) {
    const response = await this._patch('/user/update-password', passwordData);
    return response;
  }

  // Wallet Management Methods
  async getUserBalance(userId) {
    const response = await this._get(`/wallet/balance/${userId}`);
    return response.data.balance;
  }

  async getUserTransactions(userId) {
    const response = await this._get(`/wallet/transactions/${userId}`);
    return response.data;
  }

  async sendTransactionOTP(userId, purpose) {
    const response = await this._post('/wallet/send-transaction-otp', {
      userId,
      purpose
    });
    return response;
  }

  async sendMoneyWithOTP(transactionData) {
    const response = await this._post('/wallet/send-with-otp', transactionData);
    return response;
  }

  async addMoneyWithOTP(addMoneyData) {
    const response = await this._post('/wallet/add-money-with-otp', addMoneyData);
    return response;
  }

  // Legacy methods for backward compatibility
  async sendMoney(transactionData) {
    const response = await this._post('/wallet/send', transactionData);
    return response;
  }

  async addMoney(addMoneyData) {
    const response = await this._post('/wallet/add-money', addMoneyData);
    return response;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;