

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
    apiKey: "AIzaSyANaCIGE65ek04vTpHcaFk39ghW4YVFSA0",
    authDomain: "login-f243e.firebaseapp.com",
    projectId: "login-f243e",
    storageBucket: "login-f243e.appspot.com",
    messagingSenderId: "929262282985",
    appId: "1:929262282985:web:bb117a23ffdc287b76a878"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

console.log("Firebase Auth:", auth);
console.log("Google Auth Provider:", provider);


export { auth, provider };
export const storage = getStorage();
