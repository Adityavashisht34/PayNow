import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider, useWallet } from './context/WalletContext';
import SignIn from './pages/SignIn';
import EnhancedSignIn from './pages/EnhancedSignIn';
import SignUp from './pages/SignUp';
import DesktopLayout from './components/DesktopLayout';
import MobileLayout from './components/MobileLayout';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import SendMoney from './components/SendMoney';
import AddMoney from './components/AddMoney';
import TransactionHistory from './components/TransactionHistory';
import Settings from './components/Settings';

function AppContent() {
  const { user, layoutMode } = useWallet();

  if (!user.isAuthenticated) {
    return (
      <Routes>
        <Route path="/signin" element={<EnhancedSignIn />} />
        <Route path="/signin-legacy" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {layoutMode === 'desktop' ? (
        <Route path="/" element={<DesktopLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="send" element={<SendMoney />} />
          <Route path="add-money" element={<AddMoney />} />
          <Route path="history" element={<TransactionHistory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      ) : (
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="send" element={<SendMoney />} />
          <Route path="add-money" element={<AddMoney />} />
          <Route path="history" element={<TransactionHistory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      )}
    </Routes>
  );
}

function App() {
  return (
    <WalletProvider>
      <Router>
        <AppContent />
      </Router>
    </WalletProvider>
  );
}

export default App;