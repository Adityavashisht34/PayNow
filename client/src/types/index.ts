export interface User {
  id: string;
  email: string;
  fullName: string;
  balance: number;
  avatar?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  recipient?: string;
  sender?: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (amount: number) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  transactions: Transaction[];
}