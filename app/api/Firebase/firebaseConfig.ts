// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCrTrTKV8NZTmAK5qMw-zaFBdUKkSVwAI",
  authDomain: "reelmate-93c20.firebaseapp.com",
  projectId: "reelmate-93c20",
  storageBucket: "reelmate-93c20.firebasestorage.app",
  messagingSenderId: "568156164193",
  appId: "1:568156164193:web:752fde10b7498286d55a20",
  measurementId: "G-9JC8HHPC52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);