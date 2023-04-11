// Import the functions you need from the SDKs you need
// import * as firebase from "firebase";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'
// import messaging from '@react-native-firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQZXcrStyOlnuf2oU1MPm-CVVnQIPGWZU",
  authDomain: "buzzpool-test.firebaseapp.com",
  projectId: "buzzpool-test",
  storageBucket: "buzzpool-test.appspot.com",
  messagingSenderId: "259892781917",
  appId: "1:259892781917:web:f8259e3f85c6a86dafbeb4",
  measurementId: "G-21VSFHWTTT"
};


// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

export const auth = firebase.auth()

export const firestore = firebase.firestore();