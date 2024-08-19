const express = require("express");
const controller = require("../../controllers/post.controller");

const router = express.Router();

router.route("/query").get(controller.query);
router.route("/:id").get(controller.get_single_post).delete(controller.delete);
router.route("/").get(controller.get_many_posts).post(controller.create);

module.exports = router;
