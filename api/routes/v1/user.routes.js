const express = require("express");
const controller = require("../../controllers/user.controller");

const router = express.Router();

router.route("/:id").get(controller.user_by_id);
router.route("/").get(controller.user_by_ids);
router.route("/by/username/:username").get(controller.user_by_username);
router.route("/by/username").get(controller.user_by_usernames);

module.exports = router;
