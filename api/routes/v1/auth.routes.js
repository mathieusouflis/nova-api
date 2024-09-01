import express from "express";
import controller from "../../controllers/auth.controller.js";

const router = express.Router();

router.route("/login").post(controller.login);
router.route("/register").post(controller.register);
router.route("/logout").post(controller.logout);

export default router;
