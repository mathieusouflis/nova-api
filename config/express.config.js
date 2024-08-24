const express = require("express");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
//JWT TEST
require("dotenv").config();

const routes = require("../api/routes/v1/index");
const { path } = require("../api/middleware/pathUsed");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();

console.log(process.env.FRONTEND_ORIGIN);
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieparser());
app.use(helmet());
app.use(bodyparser.json());
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});
app.options("*", cors(corsOptions));
app.use("/api", path, routes);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app;
