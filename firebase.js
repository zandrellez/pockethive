import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDpKEBygE2XZVbmu7VX0gu_2exroQ6Zt70",
  authDomain: "pockethive-d4d53.firebaseapp.com",
  projectId: "pockethive-d4d53",
  storageBucket: "pockethive-d4d53.firebasestorage.app",
  messagingSenderId: "12911312612",
  appId: "1:12911312612:web:cadbc74b8fca0ff9daf6f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
export default app; 