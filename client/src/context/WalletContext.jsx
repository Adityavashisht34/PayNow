import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
const WalletContext = createContext();

const initialState = {
  user: {
    id: null,
    name: '',
    email: '',
    phone: '+1 234 567 8900',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isAuthenticated: false
  },
  balance: 2450.75,
  transactions: [
    {
      id: 'tx001',
      type: 'received',
      amount: 500.00,
      from: 'Sarah Wilson',
      to: 'John Doe',
      date: new Date('2024-01-15T14:30:00Z'),
      status: 'completed',
      description: 'Payment for freelance work',
      category: 'income'
    },
    {
      id: 'tx002',
      type: 'sent',
      amount: 75.25,
      from: 'John Doe',
      to: 'Coffee Shop',
      date: new Date('2024-01-15T09:15:00Z'),
      status: 'completed',
      description: 'Coffee and breakfast',
      category: 'food'
    },
    {
      id: 'tx003',
      type: 'received',
      amount: 1200.00,
      from: 'Tech Corp Ltd',
      to: 'John Doe',
      date: new Date('2024-01-14T16:45:00Z'),
      status: 'completed',
      description: 'Monthly salary',
      category: 'salary'
    },
    {
      id: 'tx004',
      type: 'sent',
      amount: 25.50,
      from: 'John Doe',
      to: 'Uber',
      date: new Date('2024-01-14T12:20:00Z'),
      status: 'completed',
      description: 'Ride to downtown',
      category: 'transport'
    },
    {
      id: 'tx005',
      type: 'sent',
      amount: 150.00,
      from: 'John Doe',
      to: 'Electric Company',
      date: new Date('2024-01-13T10:00:00Z'),
      status: 'completed',
      description: 'Monthly electricity bill',
      category: 'utilities'
    }
  ],
  contacts: [
    {
      id: 'c001',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 234 567 8901',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      favorite: true
    },
    {
      id: 'c002',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1 234 567 8902',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      favorite: true
    },
    {
      id: 'c003',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+1 234 567 8903',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      favorite: false
    },
    {
      id: 'c004',
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1 234 567 8904',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      favorite: false
    }
  ],
  currentView: 'dashboard',
  notifications: [],
  users: [
    {
      id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    }
  ]
};

function walletReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: { 
          ...state.user, 
          ...action.payload,
          isAuthenticated: true 
        }
      };
    case 'LOGOUT':
      return {
        ...state,
        user: { 
          ...initialState.user,
          isAuthenticated: false 
        },
        currentView: 'dashboard'
      };
    case 'SIGNUP':
      return {
        ...state,
        users: [...state.users, action.payload]
      };
    case 'SEND_MONEY':
      const newTransaction = {
        id: `tx${Date.now()}`,
        type: 'sent',
        amount: action.payload.amount,
        from: state.user.name,
        to: action.payload.recipient,
        date: new Date(),
        status: 'completed',
        description: action.payload.description || 'Money transfer',
        category: 'transfer'
      };
      return {
        ...state,
        balance: state.balance - action.payload.amount,
        transactions: [newTransaction, ...state.transactions]
      };
    case 'RECEIVE_MONEY':
      const receivedTransaction = {
        id: `tx${Date.now()}`,
        type: 'received',
        amount: action.payload.amount,
        from: action.payload.sender,
        to: state.user.name,
        date: new Date(),
        status: 'completed',
        description: action.payload.description || 'Money received',
        category: 'income'
      };
      return {
        ...state,
        balance: state.balance + action.payload.amount,
        transactions: [receivedTransaction, ...state.transactions]
      };
    case 'SET_VIEW':
      return {
        ...state,
        currentView: action.payload
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    default:
      return state;
  }
}

export function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(walletReducer, initialState);
  const user = null
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:8080/user/find-user", {
        email,
        password
      });
  
      const user = res.data;
      console.log(user)
  
      if (user && user.id) {
        dispatch({ 
          type: 'LOGIN', 
          payload: {
            id: user.userId,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
          }
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };
  

  const signup = (userData) => {
    // Check if user already exists
    const existingUser = state.users.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser = {
      id: `user${Date.now()}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password
    };

    dispatch({ type: 'SIGNUP', payload: newUser });
    return true;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const sendMoney = (recipient, amount, description) => {
    if (amount <= state.balance && amount > 0) {
      dispatch({
        type: 'SEND_MONEY',
        payload: { recipient, amount: parseFloat(amount), description }
      });
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        message: `Successfully sent $${amount} to ${recipient}`,
        timestamp: new Date()
      });
      
      return true;
    }
    return false;
  };

  const receiveMoney = (sender, amount, description) => {
    dispatch({
      type: 'RECEIVE_MONEY',
      payload: { sender, amount: parseFloat(amount), description }
    });
    
    addNotification({
      id: Date.now().toString(),
      type: 'success',
      message: `Received $${amount} from ${sender}`,
      timestamp: new Date()
    });
  };

  const setView = (view) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
    }, 5000);
  };

  const value = {
    ...state,
    login,
    logout,
    signup,
    sendMoney,
    receiveMoney,
    setView,
    addNotification,
    dispatch
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