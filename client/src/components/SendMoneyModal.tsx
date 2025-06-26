import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendMoneyModal: React.FC<SendMoneyModalProps> = ({ isOpen, onClose }) => {
  const { addTransaction, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const amount = parseFloat(formData.amount);
      
      // Check if user has sufficient balance
      if (user && user.balance < amount) {
        alert('Insufficient balance');
        return;
      }

      addTransaction({
        type: 'send',
        amount,
        recipient: formData.recipient,
        description: formData.description || 'Payment',
        status: 'completed',
      });

      setFormData({ recipient: '', amount: '', description: '' });
      onClose();
    } catch (error) {
      console.error('Send money error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Money">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Recipient Email"
          type="email"
          value={formData.recipient}
          onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
          required
          placeholder="Enter recipient's email"
        />

        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          placeholder="0.00"
        />

        <Input
          label="Description (Optional)"
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What's this for?"
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="flex-1"
          >
            Send Money
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SendMoneyModal;