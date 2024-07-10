import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY, // Make sure VITE_API_KEY is correctly set in your environment
  authDomain: "vibetalk-2d94a.firebaseapp.com",
  projectId: "vibetalk-2d94a",
  storageBucket: "vibetalk-2d94a.appspot.com",
  messagingSenderId: "345150484089",
  appId: "1:345150484089:web:807d1f33a7bccd0821eea8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app); 
export const db = getFirestore(app); 
export const storage = getStorage(app); 
