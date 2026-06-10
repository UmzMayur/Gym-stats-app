import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpqKUKM4VX0X958eYivkqQ0D3C8xcaZpI",
  authDomain: "gym-stats-tracker.firebaseapp.com",
  projectId: "gym-stats-tracker",
  storageBucket: "gym-stats-tracker.firebasestorage.app",
  messagingSenderId: "577001518010",
  appId: "1:577001518010:web:d9626763124cabc9ade383"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
