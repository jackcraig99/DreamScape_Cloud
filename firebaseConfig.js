// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA... (a long string of characters)",
  authDomain: "dreamscape-mvp.firebaseapp.com",
  projectId: "dreamscape-mvp",
  storageBucket: "dreamscape-mvp.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// This is the crucial line. 
// It creates the 'auth' variable and exports it.
export const auth = getAuth(app); 

// You will also need this later
export const db = getFirestore(app);