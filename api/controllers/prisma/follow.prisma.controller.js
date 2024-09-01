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
