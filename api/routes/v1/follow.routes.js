import express from "express";
import controller from "../../controllers/follow.controller.js";

const router = express.Router();

router.route("/followers").get(controller.get_followers);

router
  .route("/following")
  .get(controller.get_following)
  .post(controller.follow);
router.route("/following/:target_user_id").delete(controller.unfollow);

export default router;
