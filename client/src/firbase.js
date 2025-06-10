// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "food-spot-8c9d1.firebaseapp.com",
  projectId: "food-spot-8c9d1",
  storageBucket: "food-spot-8c9d1.firebasestorage.app",
  messagingSenderId: "801194700048",
  appId: "1:801194700048:web:125e67c0332123fb85c995"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);