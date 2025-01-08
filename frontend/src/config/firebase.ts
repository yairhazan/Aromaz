import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyASSqkeB5zeYTWVVycOgjiMmM2DlXISHMU",
  authDomain: "aromatherapy-3241a.firebaseapp.com",
  projectId: "aromatherapy-3241a",
  storageBucket: "aromatherapy-3241a.firebasestorage.app",
  messagingSenderId: "295970241964",
  appId: "1:295970241964:web:161a361944001824dcce09"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 