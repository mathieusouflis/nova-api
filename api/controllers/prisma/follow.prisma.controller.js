import prisma from "../../../constants/prisma.js";
import id_generator from "../../../utils/functions/id.js";

class FollowPrismaController {
  async isFollowing(follower, followed) {
    const follow = await prisma.followers.findFirst({
      where: {
        follower,
        followed,
      },
    });
    return follow ? true : false;
  }

  async getFollow(target, type) {
    // TYPE 1 : FOLLOWERS
    // TYPE 2 : FOLLOWING

    const list = await prisma.followers.findMany({
      where:
        type === 1
          ? {
              followed: target,
            }
          : {
              follower: target,
            },
      include:
        type === 1
          ? {
              user_following: true,
            }
          : {
              user_followed: true,
            },
    });
    return list;
  }

  async follow(follower, followed) {
    const follow = await prisma.followers.create({
      data: {
        id: await id_generator(),
        follower,
        followed,
      },
    });
    return follow;
  }

  async unfollow(follower, followed) {
    const unfollow = await prisma.followers.deleteMany({
      where: {
        follower,
        followed,
      },
    });
    return unfollow ? true : false;
  }
}

export default new FollowPrismaController();
