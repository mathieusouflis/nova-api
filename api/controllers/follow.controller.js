import FollowPrismaController from "./prisma/follow.prisma.controller.js";
import UsersPrismaController from "./prisma/users.prisma.controller.js";

class FollowController {
  get_followers = (req, res) => {
    try {
      const baseUrl = req.baseUrl.split("/");
      const user_id = baseUrl[baseUrl.length - 1];

      const data = read("followers");
      const followers_list = data
        .filter((follow) => follow["following"] === user_id)
        .map((follow) => follow["follower"]);

      return res.status(200).json(followers_list);
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while fetching followers");
    }
  };

  get_following = (req, res) => {
    try {
      const baseUrl = req.baseUrl.split("/");
      const user_id = baseUrl[baseUrl.length - 1];

      const data = read("followers");
      const following_list = data
        .filter((follow) => follow["follower"] === user_id)
        .map((follow) => follow["following"]);

      return res.status(200).json(following_list);
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while fetching following");
    }
  };

  follow = (req, res) => {
    try {
      const baseUrl = req.baseUrl.split("/");
      const user_id = baseUrl[baseUrl.length - 1];
      const { targeted_id } = req.body;
      if (user_id !== req.user.id || user_id === targeted_id) {
        return res.status(403).send("Forbidden");
      }

      if (!UsersPrismaController.findUserById(targeted_id)) {
        return res.status(404).send("User not found");
      }

      if (FollowPrismaController.isFollowing(user_id, targeted_id) === true) {
        return res.status(409).send("User allready followed");
      }

      FollowPrismaController.follow(user_id, targeted_id);

      return res.status(201).send("User followed");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while following the user");
    }
  };

  unfollow = (req, res) => {
    try {
      const baseUrl = req.baseUrl.split("/");
      const user_id = baseUrl[baseUrl.length - 1];
      const { target_user_id } = req.params;

      if (user_id !== req.user.id) {
        return res.status(403).send("Forbidden");
      }

      if (!UsersPrismaController.findUserById(target_user_id)) {
        return res.status(404).send("User not found");
      }

      if (
        FollowPrismaController.isFollowing(user_id, target_user_id) === false
      ) {
        return res.status(404).send("Follow not found");
      }

      FollowPrismaController.unfollow(user_id, target_user_id);

      return res.status(200).send("User unfollowed");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while unfollowing the user");
    }
  };
}

export default new FollowController();
