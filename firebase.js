const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(app);
const auth = admin.auth(app);

module.exports = {
  app,
  db,
  auth,
};
