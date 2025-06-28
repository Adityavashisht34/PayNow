import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider, useWallet } from './context/WalletContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DesktopLayout from './components/DesktopLayout';
import MobileLayout from './components/MobileLayout';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user } = useWallet();
  const isDesktop = window.innerWidth >= 1024;

  if (!user.isAuthenticated) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          isDesktop ? (
            <DesktopLayout>
              <Dashboard />
            </DesktopLayout>
          ) : (
            <MobileLayout>
              <Dashboard />
            </MobileLayout>
          )
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" />} />
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
