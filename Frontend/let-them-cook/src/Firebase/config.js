// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNaInJE0SW_Hr0w2Abw4V-4raw4kQV9Ck",
  authDomain: "let-them-cook.firebaseapp.com",
  projectId: "let-them-cook",
  storageBucket: "let-them-cook.appspot.com",
  messagingSenderId: "783478630544",
  appId: "1:783478630544:web:30989ee5bc51126d6a9015"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const imageStorage = getStorage(app);