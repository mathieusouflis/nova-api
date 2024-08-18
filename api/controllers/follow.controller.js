const { read, write } = require("./database.controller");

exports.get_followers = (req, res) => {
  const baseUrl = req.baseUrl.split("/");
  const user_id = baseUrl[baseUrl.length - 1];

  const data = read("followers");
  const following_list = [];
  data.forEach((follow) => {
    if (follow["following"] === user_id) {
      following_list.push(follow["followers"]);
    }
  });

  res.status(200).json(following_list);
};

exports.get_following = (req, res) => {
  const baseUrl = req.baseUrl.split("/");
  const user_id = baseUrl[baseUrl.length - 1];

  const data = read("followers");
  const following_list = [];
  data.forEach((follow) => {
    if (follow["follower"] === user_id) {
      following_list.push(follow["following"]);
    }
  });

  res.status(200).json(following_list);
};

exports.follow = (req, res) => {
  const baseUrl = req.baseUrl.split("/");
  const user_id = baseUrl[baseUrl.length - 1];
  const { targeted_id } = req.body;

  if (user_id !== req.user.id || user_id === targeted_id) return res.send(403);

  const users_data = read("users");
  if (!users_data[targeted_id]) return res.sendStatus(404);

  const follow_data = read("followers");

  for (follow in follow_data) {
    if (
      follow_data[follow]["follower"] === user_id &&
      follow_data[follow]["following"] === targeted_id
    ) {
      return res.status(402).send("You'r allready following this user");
    }
  }
  follow_data.push({
    follower: user_id,
    following: targeted_id,
  });

  write("followers", follow_data);
  res.sendStatus(200);
};

exports.unfollow = (req, res) => {
  const baseUrl = req.baseUrl.split("/");
  const user_id = baseUrl[baseUrl.length - 1];
  const { target_user_id } = req.params;

  if (user_id !== req.user.id) return res.send(403);

  const users_data = read("users");
  if (!users_data[target_user_id]) return res.sendStatus(404);

  const data = read("followers");

  for (let i = 0; i < data.length; i++) {
    const follow = data[i];
    if (follow.follower === user_id && follow.following === target_user_id) {
      const new_data = data.slice(0, i);

      new_data.push(...data.slice(i + 1, data.length));
      write("followers", new_data);

      return res.sendStatus(200);
    }
  }

  res.sendStatus(404);
};
