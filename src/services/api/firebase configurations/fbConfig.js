import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/performance';
import 'firebase/storage';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let messaging = null;
const performance = firebase.performance();
const storage = firebase.storage();
const functions = firebase.functions();

if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
  messaging.usePublicVapidKey("");
}

export {firebase, performance, storage, messaging, functions};

