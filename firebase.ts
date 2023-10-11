import dotenv from "dotenv";
dotenv.config();
import * as admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const app = admin.initializeApp({
  credential: admin.credential.cert("./serviceAccountKey.json"),
});

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCtvgc6CithGOlW9j3NTV-WWX3T3OoFd6M",
  authDomain: "pocketcarte.firebaseapp.com",
  projectId: "pocketcarte",
  storageBucket: "pocketcarte.appspot.com",
  messagingSenderId: "172952952502",
  appId: "1:172952952502:web:5661609912878c97a8d017"
})

export default app;

export const db = admin.firestore(app);
export const auth = admin.auth(app);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);