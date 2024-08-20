const {
  likedPost,
  likingUsers,
  likeExist,
  likePost,
  unlikePost,
} = require("./prisma/like.prisma.controller");
const { getPostById } = require("./prisma/post.prisma.controller");

exports.liked_posts = async (req, res) => {
  console.log("LIked post");
  const { user_id } = req.params;
  if (req.user.id !== user_id) return res.status(403).end();

  const likes = await likedPost(user_id);

  res.json({
    likes: likes.map((like) => like.post_id),
  });
};

exports.liking_users = async (req, res) => {
  console.log("Liking USERS");
  const { post_id } = req.params;
  const post = await getPostById(post_id);
  if (!post) return res.status(404).send("Post not found.").end();
  if (post.author_id !== req.user.id)
    return res.status(403).send("Forbiden").end();

  const likes = await likingUsers(post_id);

  res.json({
    likes: likes.map((like) => like.user_id),
  });
};

exports.is_liking_post = async (req, res) => {
  console.log("Is Liking");
  const { user_id } = req.params;
  const { post_id } = req.params;
  console.log(user_id, req.user.id);
  if (user_id !== req.user.id) return res.status(403).send("Forbiden").end();
  if (!(await getPostById(post_id)))
    return res.status(404).send("Post not found.").end();

  if (await likeExist(user_id, post_id)) {
    return res.status(200).send("Liking").end();
  } else {
    return res.status(404).send("Not liking").end();
  }
};

exports.like = async (req, res) => {
  console.log("LIke");
  const { user_id } = req.params;
  const { post_id } = req.body;
  console.log(user_id);
  console.log(req.user.id);
  if (req.user.id !== user_id) return res.status(403).end();

  if ((await getPostById(post_id)) === true)
    return res.status(404).send("Post not found.").end();

  if (await likeExist(user_id, post_id)) return res.status(402);

  await likePost(user_id, post_id);
  res.status(200).send("Post Liked.").end();
};

exports.unlike = async (req, res) => {
  console.log("Unlike");
  const { user_id } = req.params;
  const { post_id } = req.params;

  console.log(user_id);
  console.log(req.user.id);
  if (user_id !== req.user.id) return res.status(403).send("Forbiden");

  if (!(await getPostById(post_id)))
    return res.status(404).send("Post not found.").end();

  if ((await likeExist(user_id, post_id)) === false)
    return res.status(404).send("Like Not found.").end();

  await unlikePost(user_id, post_id);

  res.status(200).send("Post unliked.").end();
};
