import express from "express";
const router = express.Router();
import { db } from "../../firebase";

router.get("/test/firebase", async (req, res) => {
  const snapshot = await db.collection("logs").get();
  const logs = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
  return res.status(200).json(logs);
});

export default router;
