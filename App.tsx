import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';
import HomeView from './src/views/HomeView';
import LoginView from './src/views/LoginView';
import RegisterView from './src/views/RegisterView';
import AuthUser from './src/models/AuthUser';

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => {
      setUser(u ? { uid: u.uid, email: u.email } : null);
    });
    return unsubscribe;
  }, []);

  if (user) return <HomeView />;

  return showRegister ? (
    <RegisterView onSwitchToLogin={() => setShowRegister(false)} />
  ) : (
    <LoginView onSwitchToRegister={() => setShowRegister(true)} />
  );
}