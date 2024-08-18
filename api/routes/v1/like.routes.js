const express = require("express");
const controller = require("../../controllers/like.controller.js");

const router = express.Router();

router
  .route("/users/:user_id/likes")
  .post(controller.like)
  .get(controller.liked_posts);
router.route("/users/:user_id/likes/:post_id").delete(controller.unlike);
router.route("/posts/:post_id/likes").get(controller.liking_users);

module.exports = router;
