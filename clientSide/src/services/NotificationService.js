/**
 * Notification Service - Encapsulates notification management
 */
class NotificationService {
  constructor() {
    this._notifications = [];
    this._listeners = [];
  }

  /**
   * Private method to generate unique ID
   * @private
   */
  _generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Private method to notify listeners
   * @private
   */
  _notifyListeners() {
    this._listeners.forEach(listener => {
      try {
        listener(this._notifications);
      } catch (error) {
        console.error('Notification listener error:', error);
      }
    });
  }

  /**
   * Add a notification
   */
  add(type, message, autoRemove = true) {
    const notification = {
      id: this._generateId(),
      type: type || 'info',
      message: message || '',
      timestamp: new Date(),
      autoRemove
    };

    this._notifications.unshift(notification);
    this._notifyListeners();

    // Auto remove after 5 seconds if enabled
    if (autoRemove) {
      setTimeout(() => {
        this.remove(notification.id);
      }, 5000);
    }

    return notification.id;
  }

  /**
   * Add success notification
   */
  success(message, autoRemove = true) {
    return this.add('success', message, autoRemove);
  }

  /**
   * Add error notification
   */
  error(message, autoRemove = true) {
    return this.add('error', message, autoRemove);
  }

  /**
   * Add info notification
   */
  info(message, autoRemove = true) {
    return this.add('info', message, autoRemove);
  }

  /**
   * Add warning notification
   */
  warning(message, autoRemove = true) {
    return this.add('warning', message, autoRemove);
  }

  /**
   * Remove a notification by ID
   */
  remove(id) {
    const initialLength = this._notifications.length;
    this._notifications = this._notifications.filter(n => n.id !== id);
    
    if (this._notifications.length !== initialLength) {
      this._notifyListeners();
    }
  }

  /**
   * Clear all notifications
   */
  clear() {
    if (this._notifications.length > 0) {
      this._notifications = [];
      this._notifyListeners();
    }
  }

  /**
   * Get all notifications
   */
  getAll() {
    return [...this._notifications];
  }

  /**
   * Subscribe to notification changes
   */
  subscribe(listener) {
    if (typeof listener === 'function') {
      this._listeners.push(listener);
      
      // Return unsubscribe function
      return () => {
        this._listeners = this._listeners.filter(l => l !== listener);
      };
    }
    
    throw new Error('Listener must be a function');
  }

  /**
   * Get notification count
   */
  getCount() {
    return this._notifications.length;
  }

  /**
   * Get notifications by type
   */
  getByType(type) {
    return this._notifications.filter(n => n.type === type);
  }
}

// Create and export a singleton instance
const notificationService = new NotificationService();
export default notificationService;