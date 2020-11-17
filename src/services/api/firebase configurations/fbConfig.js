import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/messaging';
import 'firebase/performance';
import 'firebase/storage';

let firebaseConfig = {
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

if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();
  messaging.usePublicVapidKey("");
}

export {firebase, performance, storage, messaging};

