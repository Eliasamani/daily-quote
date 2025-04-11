import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getFirestore } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';

// @ts-ignore
import { getReactNativePersistence } from '@firebase/auth/dist/rn/index.js';

const {
  FIREBASE_API_KEY="AIzaSyD1RMCoyz3w80rOQUMB2zXTpkD3ae8cRTE",
  FIREBASE_AUTH_DOMAIN="dailyquote-568e4.firebaseapp.com",
  FIREBASE_PROJECT_ID="dailyquote-568e4",
  FIREBASE_STORAGE_BUCKET="dailyquote-568e4.firebasestorage.app",
  FIREBASE_MESSAGING_SENDER_ID="626767378710",
  FIREBASE_APP_ID="1:626767378710:web:fa7d72a836cf276573b837",
  FIREBASE_MEASUREMENT_ID="G-7X9NHRTM2L",
} = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth =
  Platform.OS !== 'web'
    ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
    : getAuth(app);

    export const db = getFirestore(app);
