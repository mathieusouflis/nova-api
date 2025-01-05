import express from "express";
import controller from "../../controllers/like.controller.js";

const router = express.Router();

router
  .route("/users/:user_id/likes")
  .post(controller.like)
  .get(controller.liked_posts);
router.route("/users/:user_id/likes/:post_id").delete(controller.unlike);
router.route("/posts/:post_id/likes").get(controller.liking_users);
router.route("/posts/:post_id/likes/:user_id").get(controller.is_liking_post);

export default router;
