// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbfksXS4tMMMtubHcexSWA_mIpdnLgQk4",
  authDomain: "busybuyproject.firebaseapp.com",
  projectId: "busybuyproject",
  storageBucket: "busybuyproject.appspot.com",
  messagingSenderId: "364225319375",
  appId: "1:364225319375:web:ee4bfde84911e24df502ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db  = getFirestore(app);

export default db;