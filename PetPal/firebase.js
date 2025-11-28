import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDHye3k3oh0FyhMBPISbMoD3onzqCoUgQo",
  authDomain: "petpal-4.firebaseapp.com",
  projectId: "petpal-4",
  storageBucket: "petpal-4.firebasestorage.app",
  messagingSenderId: "273641064124",
  appId: "1:273641064124:web:0a0defa3feb0cb81dc72b9"
};


const app = initializeApp(firebaseConfig);

export { auth, messaging };
export default app;