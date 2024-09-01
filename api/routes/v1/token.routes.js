import express from "express";
import controller from "../../controllers/token.controller.js";

const router = express.Router();

router.route("/refresh").post(controller.refresh_token);

export default router;
