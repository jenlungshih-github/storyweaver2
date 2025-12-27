
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe0xRQjLPN5gCXWrJ-g76zzbrD2dLqnE8",
  authDomain: "storyweaver2-1104f.firebaseapp.com",
  projectId: "storyweaver2-1104f",
  storageBucket: "storyweaver2-1104f.firebasestorage.app",
  messagingSenderId: "230241424856",
  appId: "1:230241424856:web:b84d8860797ed046a34ead",
  measurementId: "G-7V21YYJXE3"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
