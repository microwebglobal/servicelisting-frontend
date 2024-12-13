// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJO1dVZ_B1Kl5ZoWs8A_taSzUpTUtVOQ0",
  authDomain: "hearbalflow.firebaseapp.com",
  projectId: "hearbalflow",
  storageBucket: "hearbalflow.appspot.com",
  messagingSenderId: "461368842155",
  appId: "1:461368842155:web:c2aa3c9f3be1b158e1a4ee",
  measurementId: "G-NRH5ZGDR5S",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics only if it's supported and on the client-side
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(app);
    }
  });
}
