export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(date) {
  const now = new Date();
  const transactionDate = new Date(date);
  const diffInDays = Math.floor((now - transactionDate) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return transactionDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return transactionDate.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    return transactionDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: transactionDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
}

export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function validateAmount(amount) {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num <= 10000;
}

export function generateTransactionId() {
  return 'tx' + Date.now() + Math.random().toString(36).substr(2, 9);
}