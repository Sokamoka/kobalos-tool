import { initializeApp } from 'firebase/app';
import { getDatabase, ref } from 'firebase/database';
import { getAuth, OAuthProvider } from 'firebase/auth';

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
const app = initializeApp(firebaseConfig);

// utils
const db = getDatabase(app);
const auth = getAuth(app);

const provider = new OAuthProvider('microsoft.com');
// provider.setCustomParameters({
//   tenant: import.meta.env.VITE_APP_TENANT,
// });

// References
const featuresRef = ref(db, 'kobalos/features');
const settingsRef = ref(db, 'kobalos/settings');
const maintenanceRef = ref(db, 'kobalos/maintenance');
const environmentsRef = ref(db, 'environments');

// export utils/refs
export { db, auth, provider, featuresRef, settingsRef, maintenanceRef, environmentsRef };
