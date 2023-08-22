import express from "express";
const app = express();
import cors from "cors";
import routes from "./src/routes";

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3000, () => {
  console.log("listening 3000 port");
});
