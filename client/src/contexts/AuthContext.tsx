import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Transaction, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('walletUser');
    const savedTransactions = localStorage.getItem('walletTransactions');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      email,
      fullName: 'John Doe',
      balance: 2500.50,
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('walletUser', JSON.stringify(mockUser));
    return true;
  };

  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      fullName,
      balance: 100.00, // Welcome bonus
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('walletUser', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setTransactions([]);
    localStorage.removeItem('walletUser');
    localStorage.removeItem('walletTransactions');
  };

  const updateBalance = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, balance: user.balance + amount };
      setUser(updatedUser);
      localStorage.setItem('walletUser', JSON.stringify(updatedUser));
    }
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem('walletTransactions', JSON.stringify(updatedTransactions));
    
    // Update balance based on transaction type
    const balanceChange = transaction.type === 'send' ? -transaction.amount : transaction.amount;
    updateBalance(balanceChange);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateBalance,
    addTransaction,
    transactions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};