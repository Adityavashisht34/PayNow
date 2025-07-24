import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi, walletApi } from '../api/enhancedApi';

const WalletContext = createContext();

function WalletProvider({ children }) {
  // Simple state variables - no dispatcher!
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    phone: '+1 234 567 8900',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isAuthenticated: false
  });

  const [balance, setBalance] = useState(0); // Start with 0 balance
  const [currentView, setCurrentView] = useState('dashboard');
  const [layoutMode, setLayoutMode] = useState('desktop');
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]); // Start with empty transactions
  const [contacts, setContacts] = useState([]); // Start with empty contacts
  const [loading, setLoading] = useState(false);

  // Load user from localStorage on startup
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
          // Load user data after setting user
          setTimeout(() => {
            loadUserData(parsedUser.id);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }, []);

  // Load all users as contacts when user logs in
  const loadContacts = async () => {
    try {
      const response = await userApi.getAllUsers();
      if (response.success) {
        // Convert users to contacts format, excluding current user
        const userContacts = response.data
          .filter(u => u.userId !== user.id) // Don't include current user
          .map(u => ({
            id: u.userId,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            phone: u.mobile || '+1 234 567 8900',
            avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            favorite: false
          }));
        
        setContacts(userContacts);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      // Keep contacts empty if API fails
      setContacts([]);
    }
  };

  // Load user data (balance, transactions) from API
  const loadUserData = async (userId = user.id) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Load user balance
      const balanceResponse = await walletApi.getBalance(userId);
      if (balanceResponse.success) {
        setBalance(balanceResponse.data.balance);
      }

      // Load user transactions
      const transactionsResponse = await walletApi.getTransactions(userId);
      if (transactionsResponse.success) {
        // Convert backend transactions to frontend format
        const formattedTransactions = transactionsResponse.data.map(t => ({
          id: t.transactionId,
          type: t.fromUserId === userId ? 'sent' : 'received',
          amount: t.amount,
          // Use the enhanced user names from backend
          from: t.fromUserName || (t.fromUserId === 'SYSTEM' ? 'System' : 'Unknown User'),
          to: t.toUserName || 'Unknown User',
          date: new Date(t.createdAt),
          status: t.status.toLowerCase(),
          description: t.description || 'Transfer',
          category: t.type.toLowerCase()
        }));
        setTransactions(formattedTransactions);
      }

      // Load contacts (other users)
      await loadContacts();

    } catch (error) {
      console.error('Error loading user data:', error);
      // Set default values if API fails
      setBalance(0);
      setTransactions([]);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Simple login function
  const login = async (email, password) => {
    try {
      // Handle OTP login case
      if (password === 'otp-login') {
        // User data is already set from OTP verification
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        
        // Load user data after login
        setTimeout(() => {
          loadUserData(userData.id);
        }, 100);
        
        return true;
      }

      // Handle regular password login
      const response = await userApi.login({ email, password });
      
      if (response.success && response.data) {
        const userData = {
          id: response.data.userId,
          name: `${response.data.firstName} ${response.data.lastName}`,
          email: response.data.email,
          phone: response.data.mobile || '+1 234 567 8900',
          avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          isAuthenticated: true
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Load user data after login
        setTimeout(() => {
          loadUserData(userData.id);
        }, 100);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Simple logout function
  const logout = () => {
    setUser({
      id: null,
      name: '',
      email: '',
      phone: '+1 234 567 8900',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isAuthenticated: false
    });
    localStorage.removeItem('user');
    setCurrentView('dashboard');
    setBalance(0);
    setTransactions([]);
    setContacts([]);
  };

  // Legacy send money function (for backward compatibility)
  const sendMoney = async (recipientName, amount, description) => {
    if (amount <= balance && amount > 0) {
      try {
        // Find recipient by name
        const recipient = contacts.find(c => c.name === recipientName);
        if (!recipient) {
          throw new Error('Recipient not found');
        }

        // Call API to send money (legacy method without OTP)
        const response = await walletApi.sendMoney({
          fromUserId: user.id,
          toUserEmail: recipient.email,
          amount: amount,
          description: description
        });

        if (response.success) {
          // Reload user data to get updated balance and transactions
          await loadUserData();

          addNotification({
            id: Date.now().toString(),
            type: 'success',
            message: `Successfully sent ₹${amount} to ${recipientName}`,
            timestamp: new Date()
          });
          
          return true;
        }
      } catch (error) {
        console.error('Send money error:', error);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          message: error.message || 'Failed to send money. Please try again.',
          timestamp: new Date()
        });
      }
    }
    return false;
  };

  // Legacy add money function (for backward compatibility)
  const addMoney = async (amount, description = 'Balance added') => {
    if (amount > 0) {
      try {
        const response = await walletApi.addMoney({
          userId: user.id,
          amount: amount,
          description: description
        });

        if (response.success) {
          // Reload user data to get updated balance and transactions
          await loadUserData();

          addNotification({
            id: Date.now().toString(),
            type: 'success',
            message: `Successfully added ₹${amount} to your wallet`,
            timestamp: new Date()
          });
          
          return true;
        }
      } catch (error) {
        console.error('Add money error:', error);
        addNotification({
          id: Date.now().toString(),
          type: 'error',
          message: error.message || 'Failed to add money. Please try again.',
          timestamp: new Date()
        });
      }
    }
    return false;
  };

  // Simple notification function
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Simple remove notification function
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Simple view setter
  const setView = (view) => {
    setCurrentView(view);
  };

  // All the values we want to share
  const value = {
    // State
    user,
    balance,
    transactions,
    contacts,
    currentView,
    layoutMode,
    notifications,
    loading,
    
    // Functions
    login,
    logout,
    sendMoney,
    addMoney,
    setView,
    setLayoutMode,
    addNotification,
    removeNotification,
    loadUserData,
    loadContacts
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export { WalletProvider };