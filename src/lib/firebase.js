import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chat-app-v2-48f9c.firebaseapp.com",
  projectId: "chat-app-v2-48f9c",
  storageBucket: "chat-app-v2-48f9c.appspot.com",
  messagingSenderId: "1056465795136",
  appId: "1:1056465795136:web:43497eff3028f9a91487a5"
};

const app = initializeApp(firebaseConfig);

export const  auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();