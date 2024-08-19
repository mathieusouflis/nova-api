const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");

//JWT TEST
require("dotenv").config();

const routes = require("../api/routes/v1/index");
const { path } = require("../api/middleware/pathUsed");

const app = express();
app.use(bodyparser());

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

// app.use(cors(corsOptions));

app.use("/api", cors(corsOptions), path, routes);

module.exports = app;
