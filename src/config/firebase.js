import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7WFzpXcQaBoEB1WSXmnpg4xs3wq2UzuI",
  authDomain: "nil-ks.firebaseapp.com",
  projectId: "nil-ks",
  storageBucket: "nil-ks.firebasestorage.app",
  messagingSenderId: "894319004073",
  appId: "1:894319004073:web:b450b9110732c737789cb8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
