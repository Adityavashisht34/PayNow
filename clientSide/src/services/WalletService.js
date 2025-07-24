/**
 * Wallet Service - Encapsulates wallet-related business logic
 */
import apiService from './ApiService.js';

class WalletService {
  constructor() {
    this._balance = 0;
    this._transactions = [];
  }

  /**
   * Private method to validate amount
   * @private
   */
  _validateAmount(amount, balance = null) {
    const num = parseFloat(amount);
    
    if (!amount || isNaN(num) || num <= 0) {
      return { valid: false, message: 'Amount must be greater than 0' };
    }
    
    if (num > 100000) {
      return { valid: false, message: 'Amount cannot exceed ₹1,00,000' };
    }
    
    if (balance !== null && num > balance) {
      return { valid: false, message: 'Insufficient balance' };
    }
    
    return { valid: true, message: '' };
  }

  /**
   * Private method to format transactions for frontend
   * @private
   */
  _formatTransactions(transactions, userId) {
    return transactions.map(t => ({
      id: t.transactionId,
      type: t.fromUserId === userId ? 'sent' : 'received',
      amount: t.amount,
      from: t.fromUserName || (t.fromUserId === 'SYSTEM' ? 'System' : 'Unknown User'),
      to: t.toUserName || 'Unknown User',
      date: new Date(t.createdAt),
      status: t.status.toLowerCase(),
      description: t.description || 'Transfer',
      category: t.type.toLowerCase()
    }));
  }

  /**
   * Get user balance
   */
  async getBalance(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      this._balance = await apiService.getUserBalance(userId);
      return this._balance;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0; // Return 0 as fallback
    }
  }

  /**
   * Get user transactions
   */
  async getTransactions(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      const transactions = await apiService.getUserTransactions(userId);
      this._transactions = this._formatTransactions(transactions, userId);
      return this._transactions;
    } catch (error) {
      console.error('Failed to get transactions:', error);
      return []; // Return empty array as fallback
    }
  }

  /**
   * Send transaction OTP
   */
  async sendTransactionOTP(userId, purpose) {
    if (!userId || !purpose) {
      throw new Error('User ID and purpose are required');
    }

    try {
      return await apiService.sendTransactionOTP(userId, purpose);
    } catch (error) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  }

  /**
   * Send money with OTP verification
   */
  async sendMoneyWithOTP(transactionData) {
    const { fromUserId, toUserEmail, amount, description, otpCode } = transactionData;

    // Validate required fields
    if (!fromUserId || !toUserEmail || !amount || !otpCode) {
      throw new Error('All transaction fields are required');
    }

    // Validate amount
    const validation = this._validateAmount(amount, this._balance);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    try {
      const response = await apiService.sendMoneyWithOTP(transactionData);
      
      // Update local balance and transactions
      await this.getBalance(fromUserId);
      await this.getTransactions(fromUserId);
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to send money');
    }
  }

  /**
   * Add money with OTP verification
   */
  async addMoneyWithOTP(addMoneyData) {
    const { userId, amount, description, otpCode } = addMoneyData;

    // Validate required fields
    if (!userId || !amount || !otpCode) {
      throw new Error('All fields are required');
    }

    // Validate amount
    const validation = this._validateAmount(amount);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    try {
      const response = await apiService.addMoneyWithOTP(addMoneyData);
      
      // Update local balance and transactions
      await this.getBalance(userId);
      await this.getTransactions(userId);
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to add money');
    }
  }

  /**
   * Legacy send money (without OTP)
   */
  async sendMoney(transactionData) {
    const { fromUserId, toUserEmail, amount, description } = transactionData;

    // Validate required fields
    if (!fromUserId || !toUserEmail || !amount) {
      throw new Error('All transaction fields are required');
    }

    // Validate amount
    const validation = this._validateAmount(amount, this._balance);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    try {
      const response = await apiService.sendMoney(transactionData);
      
      // Update local balance and transactions
      await this.getBalance(fromUserId);
      await this.getTransactions(fromUserId);
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to send money');
    }
  }

  /**
   * Legacy add money (without OTP)
   */
  async addMoney(addMoneyData) {
    const { userId, amount, description } = addMoneyData;

    // Validate required fields
    if (!userId || !amount) {
      throw new Error('User ID and amount are required');
    }

    // Validate amount
    const validation = this._validateAmount(amount);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

    try {
      const response = await apiService.addMoney(addMoneyData);
      
      // Update local balance and transactions
      await this.getBalance(userId);
      await this.getTransactions(userId);
      
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to add money');
    }
  }

  /**
   * Get cached balance
   */
  getCachedBalance() {
    return this._balance;
  }

  /**
   * Get cached transactions
   */
  getCachedTransactions() {
    return this._transactions;
  }

  /**
   * Clear cached data
   */
  clearCache() {
    this._balance = 0;
    this._transactions = [];
  }
}

// Create and export a singleton instance
const walletService = new WalletService();
export default walletService;