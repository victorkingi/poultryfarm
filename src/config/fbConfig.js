import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/messaging'

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.functions();
firebase.firestore();
const myFirebase = firebase;
const messaging = firebase.messaging();

messaging.usePublicVapidKey("BAKZFaJ-BRXiOD_-PIzqLcqwXOjqx0j5vEqW8CWYWfB9T7v7YK_o5fzR_LPi6LNx8U31YXxxPWHx_VBUQ6nmpJM");

export {myFirebase, messaging};

