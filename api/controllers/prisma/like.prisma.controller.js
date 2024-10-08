import id_generator from "../../../utils/functions/id.js";
import prisma from "../../../constants/prisma.js";

class LikePrismaController {
  async likedPost(user_id) {
    return await prisma.likes.findMany({
      where: {
        user_id, // Ensure user_id is an integer
      },
      select: {
        post_id: true,
      },
    });
  }

  async likingUsers(post_id) {
    const like = await prisma.likes.findMany({
      where: {
        post_id,
      },
      select: {
        user_id: true,
      },
    });

    return like;
  }

  async likeExist(user_id, post_id) {
    const like = (await prisma.likes.findFirst({
      where: {
        post_id,
        user_id,
      },
    }))
      ? true
      : false;

    return like;
  }

  async likePost(user_id, post_id) {
    const id = await id_generator();
    const like = await prisma.likes.create({
      data: {
        id: id.toString(),
        user_id,
        post_id,
      },
    });

    return like;
  }

  async unlikePost(user_id, post_id) {
    const like = await prisma.likes.deleteMany({
      where: {
        user_id,
        post_id,
      },
    });

    return like;
  }

  async getLikesCount(postId) {
    const count = await prisma.likes.count({
      where: {
        post_id: postId,
      },
    });

    return count;
  }
}

export default new LikePrismaController();
