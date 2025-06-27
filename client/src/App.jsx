import React from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import AuthScreen from './components/AuthScreen';
import DesktopLayout from './components/DesktopLayout';
import MobileLayout from './components/MobileLayout';

function AppContent() {
  const { user } = useWallet();

  if (!user.isAuthenticated) {
    return <AuthScreen />;
  }

  // Check if it's desktop or mobile
  const isDesktop = window.innerWidth >= 1024;

  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

export default App;