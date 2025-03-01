// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace the following config with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEsdqzuGVdrrzhF__2nUf7CYCOoVEDpDU",
  authDomain: "mysite-e02fd.firebaseapp.com",
  projectId: "mysite-e02fd",
  storageBucket: "mysite-e02fd.firebasestorage.app",
  messagingSenderId: "827000837251",
  appId: "1:827000837251:web:2dfefc2ff60228d74eb7b6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
