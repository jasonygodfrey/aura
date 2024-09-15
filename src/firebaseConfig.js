import { initializeApp } from 'firebase/app';
import { getAuth, browserSessionPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Ensure Firestore is imported
import { getStorage } from 'firebase/storage'; // Ensure Storage is imported

const firebaseConfig = {
  apiKey: "AIzaSyCHKQSmscgOgnfce6m9aXKK-w_zlzAEKyU",
  authDomain: "auraauth1.firebaseapp.com",
  projectId: "auraauth1",
  storageBucket: "auraauth1.appspot.com",
  messagingSenderId: "304637821155",
  appId: "1:304637821155:web:627f99388e7017e76e45d6",
  measurementId: "G-2QJX1ELNVV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

// Set session persistence
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error('Error setting persistence:', error);
});

export { auth, db, storage };
