import express from "express";
import controller from "../../controllers/post.controller.js";

const router = express.Router();

router.route("/query").get(controller.query);
router.route("/:id").get(controller.get_single_post).delete(controller.delete);
router.route("/").get(controller.get_many_posts).post(controller.create);

export default router;
