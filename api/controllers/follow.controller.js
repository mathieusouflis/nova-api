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

      const users_data = read("users");
      if (!users_data[targeted_id]) {
        return res.status(404).send("User not found");
      }

      const follow_data = read("followers");

      const alreadyFollowing = follow_data.some(
        (follow) =>
          follow["follower"] === user_id && follow["following"] === targeted_id,
      );

      if (alreadyFollowing) {
        return res.status(409).send("You are already following this user");
      }

      follow_data.push({
        follower: user_id,
        following: targeted_id,
      });

      write("followers", follow_data);
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

      const users_data = read("users");
      if (!users_data[target_user_id]) {
        return res.status(404).send("User not found");
      }

      const follow_data = read("followers");
      const followIndex = follow_data.findIndex(
        (follow) =>
          follow.follower === user_id && follow.following === target_user_id,
      );

      if (followIndex === -1) {
        return res.status(404).send("Follow not found");
      }

      follow_data.splice(followIndex, 1);
      write("followers", follow_data);

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
