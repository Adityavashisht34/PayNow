import React, { createContext, useContext, useState, useEffect } from 'react';
import { userApi, walletApi } from '../api/enhancedApi';

const WalletContext = createContext();

function WalletProvider({ children }) {
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    phone: '+1 234 567 8900',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isAuthenticated: false
  });

  const [balance, setBalance] = useState(0);
  const [currentView, setCurrentView] = useState('dashboard');
  const [layoutMode, setLayoutMode] = useState('desktop');
  const [autoLayout, setAutoLayout] = useState(true); // New: to allow auto/manual override
  const [notifications, setNotifications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Automatically switch layout based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (!autoLayout) return; // Skip if manually overridden
      const width = window.innerWidth;
      if (width < 768) {
        setLayoutMode('mobile');
      } else {
        setLayoutMode('desktop');
      }
    };

    handleResize(); // Set on load

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [autoLayout]);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
          setTimeout(() => {
            loadUserData(parsedUser.id);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }, []);

  const loadContacts = async () => {
    try {
      const response = await userApi.getAllUsers();
      if (response.success) {
        const userContacts = response.data
          .filter(u => u.userId !== user.id)
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
      setContacts([]);
    }
  };

  const loadUserData = async (userId = user.id) => {
    if (!userId) return;

    setLoading(true);
    try {
      const balanceResponse = await walletApi.getBalance(userId);
      if (balanceResponse.success) {
        setBalance(balanceResponse.data.balance);
      }

      const transactionsResponse = await walletApi.getTransactions(userId);
      if (transactionsResponse.success) {
        const formattedTransactions = transactionsResponse.data.map(t => ({
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
        setTransactions(formattedTransactions);
      }

      await loadContacts();

    } catch (error) {
      console.error('Error loading user data:', error);
      setBalance(0);
      setTransactions([]);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      if (password === 'otp-login') {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
        setTimeout(() => loadUserData(userData.id), 100);
        return true;
      }

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
        setTimeout(() => loadUserData(userData.id), 100);

        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

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

  const sendMoney = async (recipientName, amount, description) => {
    if (amount <= balance && amount > 0) {
      try {
        const recipient = contacts.find(c => c.name === recipientName);
        if (!recipient) throw new Error('Recipient not found');

        const response = await walletApi.sendMoney({
          fromUserId: user.id,
          toUserEmail: recipient.email,
          amount,
          description
        });

        if (response.success) {
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

  const addMoney = async (amount, description = 'Balance added') => {
    if (amount > 0) {
      try {
        const response = await walletApi.addMoney({
          userId: user.id,
          amount,
          description
        });

        if (response.success) {
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

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const setView = (view) => {
    setCurrentView(view);
  };

  // Manual override function
  const setLayoutManually = (mode) => {
    setAutoLayout(false); // disable auto switching
    setLayoutMode(mode);
  };

  const value = {
    user,
    balance,
    transactions,
    contacts,
    currentView,
    layoutMode,
    autoLayout,
    notifications,
    loading,

    login,
    logout,
    sendMoney,
    addMoney,
    setView,
    setLayoutMode: setLayoutManually, 
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
