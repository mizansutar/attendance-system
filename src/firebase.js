import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCOtKV_GqA_-R5nAx2XjUBtKw3c_z7IX8c",
  authDomain: "smartpresence-a05f3.firebaseapp.com",
  databaseURL: "https://smartpresence-a05f3-default-rtdb.firebaseio.com/",
  projectId: "smartpresence-a05f3",
  storageBucket: "smartpresence-a05f3.appspot.com",
  messagingSenderId: "1074305357760",
  appId: "1:1074305357760:web:d0aa93a5cb71ca24ca5a25"
};

const app = initializeApp(firebaseConfig);

export const rtdb = getDatabase(app);
export const auth = getAuth(app);
