// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAb6zFNRLte9fDaH1fEH_lt4pd29mk3DCc",
  authDomain: "zuhedflix-originals.firebaseapp.com",
  projectId: "zuhedflix-originals",
  storageBucket: "zuhedflix-originals.appspot.com",
  messagingSenderId: "316563643512",
  appId: "1:316563643512:web:f49f61679fb7443bffe18d",
  measurementId: "G-11BYK20J87"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);
const db = getFirestore();
const auth = getAuth();

export default app;
export { auth, db };