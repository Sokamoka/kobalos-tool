import { firebase } from '@firebase/app';
import 'firebase/auth';
import 'firebase/database';

// firebase init
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};
firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.database();
const auth = firebase.auth();

const provider = new firebase.auth.OAuthProvider('microsoft.com');
provider.setCustomParameters({
  tenant: import.meta.env.VITE_APP_TENANT,
});

// References
const featuresRef = db.ref('kobalos/features');

// export utils/refs
export { db, auth, provider, featuresRef };
