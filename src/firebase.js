import { firebase } from "@firebase/app";
import "firebase/auth";
import "firebase/database";

// firebase init
const firebaseConfig = {
  apiKey: "AIzaSyCOraaD1lRuRa2mhFnYo-fUbel5P4-iYr8",
  authDomain: "slice-of-budapest.firebaseapp.com",
  databaseURL: "https://slice-of-budapest.firebaseio.com",
  projectId: "slice-of-budapest",
  storageBucket: "slice-of-budapest.appspot.com",
  messagingSenderId: "524213470589",
  appId: "1:524213470589:web:084b47796ac43445f2b814",
};
firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.database();
const auth = firebase.auth();

// References
const featuresRef = db.ref("kobalos/features");

// export utils/refs
export { db, auth, featuresRef };
