import * as admin from "firebase-admin";

const app = admin.initializeApp({
  credential: admin.credential.cert("./serviceAccountKey.json"),
});

export default app;

export const db = admin.firestore(app);
export const auth = admin.auth(app);
