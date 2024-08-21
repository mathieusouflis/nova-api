const express = require("express");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

//JWT TEST
require("dotenv").config();

const routes = require("../api/routes/v1/index");
const { path } = require("../api/middleware/pathUsed");

const app = express();
app.use(cookieparser());
app.use(helmet());
app.use(bodyparser.json());

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};

// app.use(cors(corsOptions));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use("/api", path, routes);

module.exports = app;
