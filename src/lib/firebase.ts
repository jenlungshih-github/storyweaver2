
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "storyweaver2-1104f.firebaseapp.com",
  projectId: "storyweaver2-1104f",
  storageBucket: "storyweaver2-1104f.firebasestorage.app",
  messagingSenderId: "230241424856",
  appId: "1:230241424856:web:b84d8860797ed046a34ead",
  measurementId: "G-7V21YYJXE3"
};


// Initialize Firebase
let app;
try {
  if (getApps().length === 0) {
    if (!firebaseConfig.apiKey && typeof window !== 'undefined') {
      console.warn("Firebase API Key is missing. Some features may be disabled.");
    }
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
} catch (error) {
  if (typeof window !== 'undefined') {
    console.error("Firebase failed to initialize:", error);
  }
}

export const db = app ? getFirestore(app) : undefined as any;
export const auth = app ? getAuth(app) : undefined as any;
export const storage = app ? getStorage(app) : undefined as any;

