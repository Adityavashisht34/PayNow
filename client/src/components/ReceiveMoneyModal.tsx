import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';
import { Copy, Check } from 'lucide-react';

interface ReceiveMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReceiveMoneyModal: React.FC<ReceiveMoneyModalProps> = ({ isOpen, onClose }) => {
  const { user, addTransaction } = useAuth();
  const [copied, setCopied] = useState(false);
  const [simulateReceive, setSimulateReceive] = useState(false);
  const [amount, setAmount] = useState('');

  const handleCopy = async () => {
    if (user?.email) {
      await navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulateReceive = () => {
    if (amount && parseFloat(amount) > 0) {
      addTransaction({
        type: 'receive',
        amount: parseFloat(amount),
        sender: 'demo@example.com',
        description: 'Test payment received',
        status: 'completed',
      });
      setAmount('');
      setSimulateReceive(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receive Money">
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Your Payment Email</h4>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg border">
              <p className="text-gray-900 font-mono text-sm">{user?.email}</p>
            </div>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="px-3"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Share this email with anyone who wants to send you money
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-2">Demo: Simulate Receiving Money</h4>
          <p className="text-sm text-gray-500 mb-4">
            For demonstration purposes, you can simulate receiving money
          </p>
          
          {!simulateReceive ? (
            <Button
              onClick={() => setSimulateReceive(true)}
              variant="secondary"
              className="w-full"
            >
              Simulate Receive Money
            </Button>
          ) : (
            <div className="space-y-4">
              <Input
                label="Amount to Receive"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              <div className="flex space-x-3">
                <Button
                  onClick={() => setSimulateReceive(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSimulateReceive}
                  className="flex-1"
                >
                  Receive
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ReceiveMoneyModal;