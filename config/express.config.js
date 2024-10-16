import express from "express";
import bodyparser from "body-parser";
import cookieparser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();

import routes from "../api/routes/v1/index.js";
import path from "../api/middleware/pathUsed.js";

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  sameSite: "None",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieparser());
app.use(helmet());
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send("I am Online little cookie");
});
app.use("/api", path, routes);

export default app;
