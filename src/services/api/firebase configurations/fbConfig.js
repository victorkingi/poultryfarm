import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/performance';

let firebaseConfig = {
    apiKey: "AIzaSyD3tzp-dWkeucSmG8dME_J7Zlxj9vm1hvw",
    authDomain: "poultry101-6b1ed.firebaseapp.com",
    databaseURL: "https://poultry101-6b1ed.firebaseio.com",
    projectId: "poultry101-6b1ed",
    storageBucket: "poultry101-6b1ed.appspot.com",
    messagingSenderId: "921557433248",
    appId: "1:921557433248:web:5828718b6146d8a293c2c5",
    measurementId: "G-9EHX8Z8LDZ"
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.functions();
firebase.firestore();
const myFirebase = firebase;
const messaging = firebase.messaging();
const perf = firebase.performance();

messaging.usePublicVapidKey("BAKZFaJ-BRXiOD_-PIzqLcqwXOjqx0j5vEqW8CWYWfB9T7v7YK_o5fzR_LPi6LNx8U31YXxxPWHx_VBUQ6nmpJM");

export {myFirebase, messaging, perf};

