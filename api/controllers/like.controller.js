import LikePrismaController from "./prisma/like.prisma.controller.js";
import PostPrismaController from "./prisma/post.prisma.controller.js";

class LikeController {
  async liked_posts(req, res) {
    try {
      const { user_id } = req.params;
      if (req.user.id !== user_id) {
        return res.status(403).send("Forbidden");
      }

      const likes = await LikePrismaController.likedPost(user_id);
      const postIds = likes.map((like) => like.post_id);

      return res.status(200).json({ likes: postIds });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching liked posts");
    }
  }

  async liking_users(req, res) {
    try {
      const { post_id } = req.params;
      const post = await PostPrismaController.getPostById(post_id);
      if (!post) {
        return res.status(404).send("Post not found.");
      }
      if (post.author_id !== req.user.id) {
        return res.status(403).send("Forbidden");
      }

      const likes = await LikePrismaController.likingUsers(post_id);
      const userIds = likes.map((like) => like.user_id);

      return res.status(200).json({ likes: userIds });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while fetching liking users");
    }
  }

  async is_liking_post(req, res) {
    try {
      const { user_id, post_id } = req.params;
      if (user_id !== req.user.id) {
        return res.status(403).send("Forbidden");
      }
      if (!(await PostPrismaController.getPostById(post_id))) {
        return res.status(404).send("Post not found.");
      }

      const isLiking = await LikePrismaController.likeExist(user_id, post_id);
      if (isLiking) {
        return res.status(200).send("Liking");
      } else {
        return res.status(404).send("Not liking");
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while checking like status");
    }
  }

  async like(req, res) {
    try {
      const { user_id } = req.params;
      const { post_id } = req.body;

      if (req.user.id !== user_id) {
        return res.status(403).send("Forbidden");
      }

      const post = await PostPrismaController.getPostById(req.user, post_id);
      if (!post) {
        return res.status(404).send("Post not found.");
      }

      const isLiking = await LikePrismaController.likeExist(user_id, post_id);
      if (isLiking) {
        return res.status(409).send("Already liked this post");
      }

      await LikePrismaController.likePost(user_id, post_id);
      return res.status(201).send("Post liked.");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while liking the post");
    }
  }

  async unlike(req, res) {
    try {
      const { user_id, post_id } = req.params;

      if (user_id !== req.user.id) {
        return res.status(403).send("Forbidden");
      }

      const post = await PostPrismaController.getPostById(req.user, post_id);
      if (!post) {
        return res.status(404).send("Post not found.");
      }

      const isLiking = await LikePrismaController.likeExist(user_id, post_id);
      if (!isLiking) {
        return res.status(404).send("Like not found.");
      }

      await LikePrismaController.unlikePost(user_id, post_id);
      return res.status(200).send("Post unliked.");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while unliking the post");
    }
  }
}

export default new LikeController();
