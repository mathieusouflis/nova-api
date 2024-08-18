const express = require("express");
const controller = require("../../controllers/blocking.controller");

const router = express.Router();

router.route("/").get(controller.lookup).post(controller.block);
router.route("/:targeted_user_id").delete(controller.unblock);

module.exports = router;
