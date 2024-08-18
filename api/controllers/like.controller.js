const { read, write } = require("./database.controller");

exports.liked_posts = (req, res) => {
  const { user_id } = req.params;
  if (req.user.id !== user_id) return res.sendStatus(403);

  const likes_data = read("likes");

  res.json({
    likes: likes_data
      .filter((like) => like.user_id === user_id)
      .map((like) => like.post_id),
  });
};

exports.liking_users = (req, res) => {
  const { post_id } = req.params;
  const posts_data = read("posts");
  if (!posts_data[post_id]) return res.sendStatus(404);
  if (posts_data[post_id].author_id !== req.user.id) return res.sendStatus(403);

  const likes_data = read("likes");

  res.json({
    likes: likes_data
      .filter((like) => like.post_id === post_id)
      .map((like) => like.post_id),
  });
};

exports.like = (req, res) => {
  const { user_id } = req.params;
  const { post_id } = req.body;
  if (req.user.id !== user_id) return res.sendStatus(403);

  const posts_data = read("posts");
  if (!posts_data[post_id]) return res.sendStatus(404);

  const likes_data = read("likes");
  if (
    likes_data.some(
      (like) => like.user_id !== user_id && like.post_id !== post_id,
    )
  )
    return res.status(402);
  console.log("coucou");

  likes_data.push({
    user_id,
    post_id,
  });

  write("likes", likes_data);
  res.sendStatus(200);
};

exports.unlike = (req, res) => {
  const { user_id } = req.params;
  const { post_id } = req.params;

  if (user_id !== req.user.id) return res.send(403);

  const posts_data = read("posts");
  if (!posts_data[post_id]) return res.sendStatus(404);

  let likes_data = read("likes");

  if (
    likes_data.some(
      (like) => like.user_id !== user_id && like.post_id !== post_id,
    )
  )
    return res.sendStatus(404);

  likes_data = likes_data.filter(
    (like) => like.user_id != user_id && like.post_id !== post_id,
  );

  write("likes", likes_data);
  res.sendStatus(200);
};
