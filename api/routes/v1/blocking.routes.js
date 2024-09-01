import express from "express";
import controller from "../../controllers/blocking.controller.js";

const router = express.Router();

router.route("/").get(controller.lookup).post(controller.block);
router.route("/:targeted_user_id").delete(controller.unblock);

export default router;
