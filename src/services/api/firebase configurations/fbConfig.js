import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/performance';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId:"",
    appId: "",
    measurementId: ""
};
// Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.firestore();

firebase.functions();
const myFirebase = firebase;
const messaging = firebase.messaging();
const perf = firebase.performance();
const storage = firebase.storage();

messaging.usePublicVapidKey("");

export {myFirebase, messaging, perf, storage};

