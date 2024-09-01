import express from "express";
import postRoutes from "./post.routes.js";
import userRoutes from "./user.routes.js";
import followRoutes from "./follow.routes.js";
import blockingRoutes from "./blocking.routes.js";
import likingRoutes from "./like.routes.js";
import authRoutes from "./auth.routes.js";
import tokenRoutes from "./token.routes.js";
import tokenAuthorisation from "../../middleware/tokenAuthorisation.js";

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

export default router;
