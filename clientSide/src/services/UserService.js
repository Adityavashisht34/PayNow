/**
 * User Service - Encapsulates user-related business logic
 */
import apiService from './ApiService.js';

class UserService {
  constructor() {
    this._currentUser = null;
  }

  /**
   * Private method to validate user data
   * @private
   */
  _validateUserData(userData) {
    const errors = {};
    
    if (!userData.firstName || userData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!userData.lastName || userData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!userData.email || !this._isValidEmail(userData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!userData.password || userData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!userData.mobile || userData.mobile.length < 10) {
      errors.mobile = 'Mobile number must be at least 10 digits';
    }
    
    return errors;
  }

  /**
   * Private method to validate email format
   * @private
   */
  _isValidEmail(email) {
    return email && email.includes('@') && email.includes('.');
  }

  /**
   * Private method to format user data for storage
   * @private
   */
  _formatUserForStorage(userData) {
    return {
      id: userData.userId,
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      phone: userData.mobile || '+1 234 567 8900',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isAuthenticated: true
    };
  }

  /**
   * Generate user IDs for registration
   */
  async generateIds() {
    try {
      return await apiService.generateUserIds();
    } catch (error) {
      throw new Error('Failed to generate user IDs');
    }
  }

  /**
   * Register a new user
   */
  async register(userData) {
    const validationErrors = this._validateUserData(userData);
    if (Object.keys(validationErrors).length > 0) {
      throw new Error('Validation failed');
    }

    try {
      const ids = await this.generateIds();
      const [userId, accountId] = ids;

      const userDataWithIds = {
        ...userData,
        userId,
        userAccountId: accountId
      };

      return await apiService.registerUser(userDataWithIds);
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Login with password
   */
  async loginWithPassword(emailOrMobile, password) {
    if (!emailOrMobile || !password) {
      throw new Error('Email/mobile and password are required');
    }

    try {
      const userData = await apiService.loginWithPassword(emailOrMobile, password);
      this._currentUser = this._formatUserForStorage(userData);
      this._storeUserSession(this._currentUser);
      return this._currentUser;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Send OTP for login
   */
  async sendLoginOTP(emailOrMobile) {
    if (!emailOrMobile) {
      throw new Error('Email or mobile is required');
    }

    try {
      return await apiService.sendLoginOTP(emailOrMobile);
    } catch (error) {
      throw new Error(error.message || 'Failed to send OTP');
    }
  }

  /**
   * Login with OTP
   */
  async loginWithOTP(emailOrMobile, otpCode) {
    if (!emailOrMobile || !otpCode) {
      throw new Error('Email/mobile and OTP are required');
    }

    try {
      const userData = await apiService.verifyLoginOTP(emailOrMobile, otpCode);
      this._currentUser = this._formatUserForStorage(userData);
      this._storeUserSession(this._currentUser);
      return this._currentUser;
    } catch (error) {
      throw new Error(error.message || 'OTP verification failed');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      return await apiService.getUserById(userId);
    } catch (error) {
      throw new Error('User not found');
    }
  }

  /**
   * Get all users (for contacts)
   */
  async getAllUsers() {
    try {
      return await apiService.getAllUsers();
    } catch (error) {
      throw new Error('Failed to load users');
    }
  }

  /**
   * Update password
   */
  async updatePassword(email, newPassword) {
    if (!email || !newPassword) {
      throw new Error('Email and new password are required');
    }

    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    try {
      return await apiService.updatePassword({ email, newPassword });
    } catch (error) {
      throw new Error('Password update failed');
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    if (!this._currentUser) {
      this._currentUser = this._loadUserSession();
    }
    return this._currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const user = this.getCurrentUser();
    return user && user.isAuthenticated;
  }

  /**
   * Logout user
   */
  logout() {
    this._currentUser = null;
    this._clearUserSession();
  }

  /**
   * Private method to store user session
   * @private
   */
  _storeUserSession(user) {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user session:', error);
    }
  }

  /**
   * Private method to load user session
   * @private
   */
  _loadUserSession() {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Failed to load user session:', error);
      return null;
    }
  }

  /**
   * Private method to clear user session
   * @private
   */
  _clearUserSession() {
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to clear user session:', error);
    }
  }
}

// Create and export a singleton instance
const userService = new UserService();
export default userService;