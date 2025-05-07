// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // <-- import getAuth

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMymGabJTujjp7efdS7DhcZ-XuiyXv_30",
  authDomain: "skill-sync-e74c3.firebaseapp.com",
  projectId: "skill-sync-e74c3",
  storageBucket: "skill-sync-e74c3.firebasestorage.app",
  messagingSenderId: "340247475299",
  appId: "1:340247475299:web:4237056344ea7f490c3456",
  measurementId: "G-R9BMMCZNB4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // <-- Export the auth instance
export default app;
