import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import 'firebase/messaging';
import 'firebase/performance';

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
const perf = firebase.performance();

messaging.usePublicVapidKey("YOUR_VAPID_KEY");

export {myFirebase, messaging, perf};

