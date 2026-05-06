// Firebase client SDK setup
// Replace these values with your own Firebase project config from Firebase Console -> Project Settings -> General -> Your apps -> Web App
// To get these values: go to https://console.firebase.google.com/, select your project, click gear icon -> Project Settings -> scroll down to "Your apps" -> Add Web app or copy config from existing.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// IMPORTANT: These values are taken from your google-services.json (Android),
// but for Web you NEED a Web App registered in Firebase Console.
// Go to Firebase Console -> Project Settings -> Add app -> Web (</>) -> register and paste config below.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDGE2Bs-x0BZjwfChGEFLCzUUBuI1xzu7E",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "toikz-5921a.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://toikz-5921a-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "toikz-5921a",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "toikz-5921a.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "542357949375",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:542357949375:web:0000000000000000000000",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
