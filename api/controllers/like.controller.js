const {
  likedPost,
  likingUsers,
  likeExist,
  likePost,
  unlikePost,
} = require("./prisma/like.prisma.controller");
const { getPostById } = require("./prisma/post.prisma.controller");

exports.liked_posts = async (req, res) => {
  const { user_id } = req.params;
  if (req.user.id !== user_id) return res.status(403).end();

  const likes = await likedPost(user_id);

  res.json({
    likes: likes.map((like) => like.post_id),
  });
};

exports.liking_users = async (req, res) => {
  const { post_id } = req.params;
  const post = await getPostById(post_id);
  if (!post) return res.status(404).send("Post not found.").end();
  if (post.author_id !== req.user.id) return res.status(403).end();

  const likes = await likingUsers(post_id);

  res.json({
    likes: likes.map((like) => like.user_id),
  });
};

exports.is_liking_post = async (req, res) => {
  const { user_id } = req.params;
  const { post_id } = req.params;
  if (user_id !== req.user.id) return res.status(403).end();
  if (!(await getPostById(post_id)))
    return res.status(404).send("Post not found.").end();

  if (await likeExist(user_id, post_id)) {
    return res.status(200).end();
  } else {
    return res.status(404).end();
  }
};

exports.like = async (req, res) => {
  const { user_id } = req.params;
  const { post_id } = req.body;
  if (req.user.id !== user_id) return res.status(403).end();

  if ((await getPostById(post_id)) === true)
    return res.status(404).send("Post not found.").end();

  if (await likeExist(user_id, post_id)) return res.status(402);

  await likePost(user_id, post_id);
  res.status(200).send("Post Liked.").end();
};

exports.unlike = async (req, res) => {
  const { user_id } = req.params;
  const { post_id } = req.params;

  if (user_id !== req.user.id) return res.send(403);

  if (!(await getPostById(post_id)))
    return res.status(404).send("Post not found.").end();

  if ((await likeExist(user_id, post_id)) === false)
    return res.status(404).send("Like Not found.").end();

  await unlikePost(user_id, post_id);

  res.status(200).send("Post unliked.").end();
};
