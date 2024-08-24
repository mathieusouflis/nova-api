const {
  likedPost,
  likingUsers,
  likeExist,
  likePost,
  unlikePost,
} = require("./prisma/like.prisma.controller");
const { getPostById } = require("./prisma/post.prisma.controller");

exports.liked_posts = async (req, res) => {
  try {
    console.log("Liked posts");

    const { user_id } = req.params;
    if (req.user.id !== user_id) {
      return res.status(403).send("Forbidden");
    }

    const likes = await likedPost(req.prisma, user_id);
    const postIds = likes.map((like) => like.post_id);

    return res.status(200).json({ likes: postIds });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while fetching liked posts");
  }
};

exports.liking_users = async (req, res) => {
  try {
    console.log("Liking users");

    const { post_id } = req.params;
    const post = await getPostById(req.prisma, post_id);
    if (!post) {
      return res.status(404).send("Post not found.");
    }
    if (post.author_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }

    const likes = await likingUsers(req.prisma, post_id);
    const userIds = likes.map((like) => like.user_id);

    return res.status(200).json({ likes: userIds });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("An error occurred while fetching liking users");
  }
};

exports.is_liking_post = async (req, res) => {
  try {
    console.log("Is Liking");

    const { user_id, post_id } = req.params;
    if (user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }
    if (!(await getPostById(req.prisma, post_id))) {
      return res.status(404).send("Post not found.");
    }

    const isLiking = await likeExist(req.prisma, user_id, post_id);
    if (isLiking) {
      return res.status(200).send("Liking");
    } else {
      return res.status(404).send("Not liking");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while checking like status");
  }
};

exports.like = async (req, res) => {
  try {
    console.log("Like");

    const { user_id } = req.params;
    const { post_id } = req.body;

    if (req.user.id !== user_id) {
      return res.status(403).send("Forbidden");
    }

    const post = await getPostById(req.prisma, post_id);
    if (!post) {
      return res.status(404).send("Post not found.");
    }

    const isLiking = await likeExist(user_id, post_id);
    if (isLiking) {
      return res.status(409).send("Already liked this post");
    }

    await likePost(req.prisma, user_id, post_id);
    return res.status(201).send("Post liked.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while liking the post");
  }
};

exports.unlike = async (req, res) => {
  try {
    console.log("Unlike");

    const { user_id, post_id } = req.params;

    if (user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }

    const post = await getPostById(req.prisma, post_id);
    if (!post) {
      return res.status(404).send("Post not found.");
    }

    const isLiking = await likeExist(user_id, post_id);
    if (!isLiking) {
      return res.status(404).send("Like not found.");
    }

    await unlikePost(req.prisma, user_id, post_id);
    return res.status(200).send("Post unliked.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while unliking the post");
  }
};
