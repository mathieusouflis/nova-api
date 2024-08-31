const express = require("express");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const routes = require("../api/routes/v1/index");
const { path } = require("../api/middleware/pathUsed");

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

app.options("*", cors(corsOptions));
app.use("/api", path, routes);

module.exports = app;
