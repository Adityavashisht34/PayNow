import React from 'react';
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
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const { balance, transactions, setView, user } = useWallet();
  const [showBalance, setShowBalance] = React.useState(true);

  const recentTransactions = transactions.slice(0, 5);
  const thisMonthIncome = transactions
    .filter(t => t.type === 'received' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  
  const thisMonthExpenses = transactions
    .filter(t => t.type === 'sent' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const quickActions = [
    {
      icon: Send,
      label: 'Send Money',
      action: () => setView('send'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Download,
      label: 'Receive',
      action: () => setView('receive'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Clock,
      label: 'History',
      action: () => setView('history'),
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]}!</h2>
            <p className="text-blue-100">Manage your finances with ease</p>
          </div>
          <img 
            src={user.avatar} 
            alt="Profile" 
            className="w-12 h-12 rounded-full border-2 border-white"
          />
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
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white p-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg`}
            >
              <action.icon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium block">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Overview */}
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

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
          <button 
            onClick={() => setView('history')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}