
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADKrhrS2aGsfRYu2XzMtCAi4MaB0VaGhU",
  authDomain: "studio-685786073-fc016.firebaseapp.com",
  projectId: "studio-685786073-fc016",
  storageBucket: "studio-685786073-fc016.firebasestorage.app",
  messagingSenderId: "581895241680",
  appId: "1:581895241680:web:010fa03652770ec4d043d5"
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
