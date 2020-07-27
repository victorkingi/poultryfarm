import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyD3tzp-dWkeucSmG8dME_J7Zlxj9vm1hvw",
    authDomain: "poultry101-6b1ed.firebaseapp.com",
    databaseURL: "https://poultry101-6b1ed.firebaseio.com",
    projectId: "poultry101-6b1ed",
    storageBucket: "poultry101-6b1ed.appspot.com",
    messagingSenderId: "921557433248",
    appId: "1:921557433248:web:ea8b85d8f07833da93c2c5",
    measurementId: "G-FT0FWW0CWR"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.functions();
firebase.firestore();

export default firebase;

