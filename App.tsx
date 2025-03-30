import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { auth } from './src/config/firebase';
import HomeView from './src/views/HomeView';
import LoginView from './src/views/LoginView';
import RegisterView from './src/views/RegisterView';
import { store, RootState, AppDispatch } from './src/store/store';
import { setUser, toggleRegister } from './src/store/slices/authSlice';

const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, showRegister } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => {
      dispatch(setUser(u ? { uid: u.uid, email: u.email } : null));
    });
    return unsubscribe;
  }, [dispatch]);

  if (user) return <HomeView />;

  return showRegister ? (
    <RegisterView onSwitchToLogin={() => dispatch(toggleRegister(false))} />
  ) : (
    <LoginView onSwitchToRegister={() => dispatch(toggleRegister(true))} />
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
