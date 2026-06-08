import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
