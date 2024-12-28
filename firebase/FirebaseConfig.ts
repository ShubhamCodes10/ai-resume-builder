import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDf-zI71LlVjj5gdcnlYvj5P3xBnBUgVAQ",
  authDomain: "fir-31914.firebaseapp.com",
  databaseURL: "https://fir-31914-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-31914",
  storageBucket: "fir-31914.appspot.com",
  messagingSenderId: "943833159563",
  appId: "1:943833159563:web:0f6f2be111060b5122818e"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);