// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsRARC3mTBWmQ-JzpbCYH5VMJLuCYp0QM",
  authDomain: "calendar-event-325e6.firebaseapp.com",
  projectId: "calendar-event-325e6",
  storageBucket: "calendar-event-325e6.appspot.com",
  messagingSenderId: "933831158330",
  appId: "1:933831158330:web:0f53f15ef40be2923d2303"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}

const auth = firebase.auth()

export { auth };