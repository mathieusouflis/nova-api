const express = require("express");
const controller = require("../../controllers/follow.controller");

const router = express.Router();

// router.route("/followers").get(controller.get_followers);

router
  .route("/following")
  .get(controller.get_following)
  .post(controller.follow);
router.route("/following/:target_user_id").delete(controller.unfollow);

module.exports = router;
