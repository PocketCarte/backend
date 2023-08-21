import express from "express";
const app = express();
import cors from "cors";

app.use(cors());

app.listen(3000, () => {
  console.log("listening 3000 port");
});
