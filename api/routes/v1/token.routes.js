const express = require("express");
const controller = require("../../controllers/token.controller");

const router = express.Router();

router.route("/refresh").get(controller.refresh_token);

module.exports = router;
