// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA16wSDTYBHaStOAunj2iwzFdLcIcaYX_Y",
    authDomain: "school-library-ae50a.firebaseapp.com",
    projectId: "school-library-ae50a",
    storageBucket: "school-library-ae50a.appspot.com",
    messagingSenderId: "673516324272",
    appId: "1:673516324272:web:e578ec6fc1c62f96884275",
    measurementId: "G-XJHMR9766X"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);