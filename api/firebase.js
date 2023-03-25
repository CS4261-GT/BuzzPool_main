// Import the functions you need from the SDKs you need
// import * as firebase from "firebase";

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'
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

const auth = firebase.auth()
const firestore = firebase.firestore();



// const user = auth.currentUser;
// if (user !== null) {
//   // The user object has basic properties such as display name, email, etc.
//   const displayName = user.displayName;
//   const email = user.email;
//   const photoURL = user.photoURL;
//   const emailVerified = user.emailVerified;

//   // The user's ID, unique to the Firebase project. Do NOT use
//   // this value to authenticate with your backend server, if
//   // you have one. Use User.getToken() instead.
//   const uid = user.uid;
// }

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });
export { auth, firestore };