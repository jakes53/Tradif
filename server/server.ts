import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import payheroRoute from "./routes/payhero-stk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Debug log for every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api", payheroRoute);

app.listen(4000, () => {
  console.log("✅ Payhero backend running at http://localhost:4000");
});
