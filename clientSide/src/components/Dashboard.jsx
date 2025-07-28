import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { 
  Send, 
  Download, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { balance, transactions, user, loadUserData } = useWallet();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (user.isAuthenticated) {
      loadUserData();
    }
  }, [user.isAuthenticated]);

  const refreshData = async () => {
    setLoading(true);
    await loadUserData();
    setLoading(false);
  };

  const recentTransactions = transactions.slice(0, 5);
  const thisMonthIncome = transactions
    .filter(t => t.type === 'received' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  
  const thisMonthExpenses = transactions
    .filter(t => t.type === 'sent' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const quickActions = [
    {
      icon: Plus,
      label: 'Add Money',
      action: () => navigate('/add-money'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Send,
      label: 'Send Money',
      action: () => navigate('/send'),
      color: 'bg-blue-500 hover:bg-blue-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h2>
            <p className="text-blue-100">Manage your finances with ease</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={refreshData}
              disabled={loading}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">Total Balance</span>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:text-blue-100 transition-colors"
            >
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-3xl font-bold">
            {showBalance ? formatCurrency(balance) : '••••••'}
          </div>
          {balance === 0 && (
            <p className="text-blue-200 text-sm mt-2">
              Add money to your wallet to start making payments
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white p-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex-1`}
            >
              <action.icon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium block text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">This Month Income</p>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(thisMonthIncome)}</p>
            </div>
            <div className="bg-green-500 p-2 rounded-lg">
              <ArrowDownLeft className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">This Month Spent</p>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(thisMonthExpenses)}</p>
            </div>
            <div className="bg-red-500 p-2 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
          <button 
            onClick={() => navigate('/history')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400">Start by adding money to your wallet</p>
              <button
                onClick={() => navigate('/add-money')}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Money
              </button>
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'received' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'received' ? (
                        <ArrowDownLeft className={`w-5 h-5 text-green-600`} />
                      ) : (
                        <ArrowUpRight className={`w-5 h-5 text-red-600`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {transaction.type === 'received' ? transaction.from : transaction.to}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'received' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'received' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}