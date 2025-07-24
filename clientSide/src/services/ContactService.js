/**
 * Contact Service - Encapsulates contact management
 */
import userService from './UserService.js';

class ContactService {
  constructor() {
    this._contacts = [];
    this._favorites = new Set();
  }

  /**
   * Private method to format user as contact
   * @private
   */
  _formatUserAsContact(user, currentUserId) {
    return {
      id: user.userId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.mobile || '+1 234 567 8900',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      favorite: this._favorites.has(user.userId)
    };
  }

  /**
   * Private method to load favorites from storage
   * @private
   */
  _loadFavorites() {
    try {
      const saved = localStorage.getItem('favoriteContacts');
      if (saved) {
        const favorites = JSON.parse(saved);
        this._favorites = new Set(favorites);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
      this._favorites = new Set();
    }
  }

  /**
   * Private method to save favorites to storage
   * @private
   */
  _saveFavorites() {
    try {
      const favorites = Array.from(this._favorites);
      localStorage.setItem('favoriteContacts', JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }

  /**
   * Load all contacts
   */
  async loadContacts() {
    const currentUser = userService.getCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      this._loadFavorites();
      
      const users = await userService.getAllUsers();
      
      // Filter out current user and format as contacts
      this._contacts = users
        .filter(user => user.userId !== currentUser.id)
        .map(user => this._formatUserAsContact(user, currentUser.id));
      
      return this._contacts;
    } catch (error) {
      console.error('Failed to load contacts:', error);
      this._contacts = [];
      return [];
    }
  }

  /**
   * Get all contacts
   */
  getContacts() {
    return [...this._contacts];
  }

  /**
   * Get favorite contacts
   */
  getFavoriteContacts() {
    return this._contacts.filter(contact => contact.favorite);
  }

  /**
   * Get non-favorite contacts
   */
  getRegularContacts() {
    return this._contacts.filter(contact => !contact.favorite);
  }

  /**
   * Search contacts
   */
  searchContacts(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.getContacts();
    }

    const term = searchTerm.toLowerCase().trim();
    
    return this._contacts.filter(contact =>
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.phone.includes(term)
    );
  }

  /**
   * Find contact by ID
   */
  findContactById(contactId) {
    return this._contacts.find(contact => contact.id === contactId);
  }

  /**
   * Find contact by email
   */
  findContactByEmail(email) {
    return this._contacts.find(contact => 
      contact.email.toLowerCase() === email.toLowerCase()
    );
  }

  /**
   * Add contact to favorites
   */
  addToFavorites(contactId) {
    const contact = this.findContactById(contactId);
    if (contact) {
      this._favorites.add(contactId);
      contact.favorite = true;
      this._saveFavorites();
      return true;
    }
    return false;
  }

  /**
   * Remove contact from favorites
   */
  removeFromFavorites(contactId) {
    const contact = this.findContactById(contactId);
    if (contact) {
      this._favorites.delete(contactId);
      contact.favorite = false;
      this._saveFavorites();
      return true;
    }
    return false;
  }

  /**
   * Toggle favorite status
   */
  toggleFavorite(contactId) {
    const contact = this.findContactById(contactId);
    if (contact) {
      if (contact.favorite) {
        return this.removeFromFavorites(contactId);
      } else {
        return this.addToFavorites(contactId);
      }
    }
    return false;
  }

  /**
   * Check if contact is favorite
   */
  isFavorite(contactId) {
    return this._favorites.has(contactId);
  }

  /**
   * Get contact count
   */
  getContactCount() {
    return this._contacts.length;
  }

  /**
   * Get favorite count
   */
  getFavoriteCount() {
    return this._favorites.size;
  }

  /**
   * Clear all contacts
   */
  clearContacts() {
    this._contacts = [];
  }

  /**
   * Refresh contacts
   */
  async refreshContacts() {
    return await this.loadContacts();
  }
}

// Create and export a singleton instance
const contactService = new ContactService();
export default contactService;