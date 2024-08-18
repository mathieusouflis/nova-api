const express = require("express");
const postRoutes = require("./post.routes.js");
const userRoutes = require("./user.routes.js");
const followRoutes = require("./follow.routes.js");
const blockingRoutes = require("./blocking.routes.js");
const likingRoutes = require("./like.routes.js");
const authRoutes = require("./auth.routes.js");
const tokenRoutes = require("./token.routes.js");
const {
  tokenAuthorisation,
} = require("../../middleware/tokenAuthorisation.js");

const router = express.Router();

router.get("/status", (req, res) => {
  res.json({
    message: "OK",
    timestamp: new Date().toISOString(),
    IP: req.ip,
    URL: req.originalUrl,
  });
});

router.use("/users", tokenAuthorisation, userRoutes);
router.use("/users/:user_id/", tokenAuthorisation, followRoutes);
router.use("/users/:user_id/blocking", tokenAuthorisation, blockingRoutes);
router.use("/posts", tokenAuthorisation, postRoutes);
router.use("/auth", authRoutes);
router.use("/tokens", tokenRoutes);
router.use("/", tokenAuthorisation, likingRoutes);

module.exports = router;
