import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { formatCurrency } from '../utils/formatters';
import { ArrowLeft, Send, Search, Star, User } from 'lucide-react';

export default function SendMoney() {
  const { balance, contacts, sendMoney, setView, addNotification } = useWallet();
  const [step, setStep] = useState(1); // 1: Select Contact, 2: Enter Amount, 3: Confirm
  const [selectedContact, setSelectedContact] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const favoriteContacts = filteredContacts.filter(contact => contact.favorite);
  const otherContacts = filteredContacts.filter(contact => !contact.favorite);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const quickAmounts = [25, 50, 100, 200];

  const handleSend = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (sendMoney(selectedContact.name, parseFloat(amount), description)) {
      setLoading(false);
      setView('dashboard');
      // Reset form
      setStep(1);
      setSelectedContact(null);
      setAmount('');
      setDescription('');
    } else {
      setLoading(false);
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'Insufficient balance or invalid amount',
        timestamp: new Date()
      });
    }
  };

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setView('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Send Money</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {favoriteContacts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              Favorites
            </h3>
            <div className="space-y-3">
              {favoriteContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    setStep(2);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={contact.avatar} 
                      alt={contact.name} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {otherContacts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">All Contacts</h3>
            <div className="space-y-3">
              {otherContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    setStep(2);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-blue-300"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={contact.avatar} 
                      alt={contact.name} 
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-gray-800">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredContacts.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No contacts found</p>
          </div>
        )}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setStep(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Enter Amount</h2>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <img 
              src={selectedContact.avatar} 
              alt={selectedContact.name} 
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">{selectedContact.name}</p>
              <p className="text-sm text-gray-500">{selectedContact.phone}</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">$</span>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-2xl text-center"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Available balance: {formatCurrency(balance)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick amounts</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickAmounts.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                ${quickAmount}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this for?"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setStep(3)}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setStep(2)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Confirm Transfer</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="text-center">
          <img 
            src={selectedContact.avatar} 
            alt={selectedContact.name} 
            className="w-16 h-16 rounded-full mx-auto mb-3"
          />
          <h3 className="text-xl font-semibold text-gray-800">{selectedContact.name}</h3>
          <p className="text-gray-500">{selectedContact.phone}</p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Amount</span>
            <span className="text-2xl font-bold text-gray-800">{formatCurrency(parseFloat(amount))}</span>
          </div>
          
          {description && (
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Description</span>
              <span className="text-gray-800">{description}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">New Balance</span>
            <span className="text-gray-800 font-semibold">
              {formatCurrency(balance - parseFloat(amount))}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSend}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Send Money</span>
          </>
        )}
      </button>
    </div>
  );
}