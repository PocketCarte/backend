const express = require("express");
const router = express.Router();
const { db } = require("../../firebase");

router.get("/test/firebase", async (req, res) => {
  const snapshot = await db.collection("logs").get();
  const logs = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
  return res.status(200).json(logs);
});

module.exports = router;
