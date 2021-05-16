import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_E0h9uojq_wg0jSr5IM0QR67_h33snro",
  authDomain: "stockwebapp-9ad1d.firebaseapp.com",
  projectId: "stockwebapp-9ad1d",
  storageBucket: "stockwebapp-9ad1d.appspot.com",
  messagingSenderId: "654783430482",
  appId: "1:654783430482:web:56b609df26ef191c06848b",
  measurementId: "G-MSY7W95R6E"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const usersCollection = db.collection('userData');

export {
  auth,
  db,
  usersCollection,
};