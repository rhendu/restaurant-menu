
import { initializeApp } from "firebase/app";

import { getDatabase, ref, set, push, get, update, remove } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyA0z6Bd3Dc2Ufflqld635iP3KBCKLBrshk",
    authDomain: "restaurant-e91c7.firebaseapp.com",
    databaseURL: "https://restaurant-e91c7-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "restaurant-e91c7",
    storageBucket: "restaurant-e91c7.appspot.com",
    messagingSenderId: "646103022877",
    appId: "1:646103022877:web:c4a582b4f06655eaf035f4"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase (app) 
export { app, database, ref, set, push, get, update, remove };