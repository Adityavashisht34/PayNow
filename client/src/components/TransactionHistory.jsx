import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  TrendingUp
} from 'lucide-react';

export default function TransactionHistory() {
  const { transactions, setView } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, sent, received
  const [filterPeriod, setFilterPeriod] = useState('all'); // all, today, week, month
  const [showFilters, setShowFilters] = useState(false);

  const filterTransactions = () => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.type === 'received' ? t.from : t.to).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by period
    if (filterPeriod !== 'all') {
      const now = new Date();
      const transactionDate = new Date();
      
      filtered = filtered.filter(t => {
        const tDate = new Date(t.date);
        switch (filterPeriod) {
          case 'today':
            return tDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return tDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return tDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const filteredTransactions = filterTransactions();

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'received')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'sent')
    .reduce((sum, t) => sum + t.amount, 0);

  const categories = [...new Set(filteredTransactions.map(t => t.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setView('dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncome)}</p>
            </div>
            <ArrowDownLeft className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">{formatCurrency(totalExpenses)}</p>
            </div>
            <ArrowUpRight className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center space-x-2"
          >
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Transactions</option>
                  <option value="received">Income</option>
                  <option value="sent">Expenses</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period
                </label>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    transaction.type === 'received' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'received' ? (
                      <ArrowDownLeft className="w-6 h-6 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {transaction.type === 'received' ? transaction.from : transaction.to}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'received' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'received' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}