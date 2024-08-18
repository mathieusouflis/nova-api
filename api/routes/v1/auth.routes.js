const express = require("express");
const controller = require("../../controllers/auth.controller");

const router = express.Router();

router.route("/login").post(controller.login);
router.route("/register").post(controller.register);
router.route("/logout").post(controller.logout);

module.exports = router;
