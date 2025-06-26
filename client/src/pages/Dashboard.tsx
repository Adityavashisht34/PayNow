import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import SendMoneyModal from '../components/SendMoneyModal';
import ReceiveMoneyModal from '../components/ReceiveMoneyModal';
import {
  Wallet,
  Send,
  Download,
  History,
  User,
  LogOut,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout, transactions } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const recentTransactions = transactions.slice(0, 5);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-100 text-sm">Total Balance</p>
            <div className="flex items-center space-x-2">
              <h2 className="text-3xl font-bold">
                {showBalance ? formatCurrency(user?.balance || 0) : '••••••'}
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="p-3 bg-white/20 rounded-full">
            <Wallet className="w-8 h-8" />
          </div>
        </div>
        <div className="flex items-center space-x-2 text-green-200">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">+12.5% from last month</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => setSendModalOpen(true)}
          className="h-16 bg-orange-600 hover:bg-orange-700 flex-col space-y-1"
        >
          <Send className="w-5 h-5" />
          <span>Send Money</span>
        </Button>
        <Button
          onClick={() => setReceiveModalOpen(true)}
          variant="secondary"
          className="h-16 flex-col space-y-1"
        >
          <Download className="w-5 h-5" />
          <span>Receive Money</span>
        </Button>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'send' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {transaction.type === 'send' 
                        ? <ArrowUpRight className="w-4 h-4" />
                        : <ArrowDownLeft className="w-4 h-4" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.type === 'send' ? 'Sent to' : 'Received from'} {
                          transaction.type === 'send' ? transaction.recipient : transaction.sender
                        }
                      </p>
                      <p className="text-sm text-gray-500">{transaction.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'send' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'send' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.status}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No transactions yet</p>
              <p className="text-sm">Your transaction history will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'send' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {transaction.type === 'send' 
                      ? <ArrowUpRight className="w-4 h-4" />
                      : <ArrowDownLeft className="w-4 h-4" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.type === 'send' ? 'Sent to' : 'Received from'} {
                        transaction.type === 'send' ? transaction.recipient : transaction.sender
                      }
                    </p>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'send' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'send' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No transactions yet</p>
            <p className="text-sm">Your transaction history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <p className="text-gray-900">{user?.fullName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p className="text-gray-900">{user?.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
          <p className="text-gray-900">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <div className="pt-4 border-t border-gray-200">
          <Button onClick={logout} variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">PayWallet</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Welcome, {user?.fullName?.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Wallet className="w-5 h-5 mr-3" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'transactions'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <History className="w-5 h-5 mr-3" />
                Transactions
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Profile
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'transactions' && renderTransactions()}
            {activeTab === 'profile' && renderProfile()}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SendMoneyModal
        isOpen={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
      />
      <ReceiveMoneyModal
        isOpen={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;