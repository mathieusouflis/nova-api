const { id_generator } = require("../../../utils/functions/id");
exports.likedPost = async (prisma, user_id) => {
  return await prisma.likes.findMany({
    where: {
      user_id, // Ensure user_id is an integer
    },
    select: {
      post_id: true,
    },
  });
};

exports.likingUsers = async (prisma, post_id) => {
  const like = await prisma.likes.findMany({
    where: {
      post_id,
    },
    select: {
      user_id: true,
    },
  });

  return like;
};

exports.likeExist = async (prisma, user_id, post_id) => {
  const like = (await prisma.likes.findFirst({
    where: {
      post_id,
      user_id,
    },
  }))
    ? true
    : false;

  return like;
};

exports.likePost = async (prisma, user_id, post_id) => {
  const id = await id_generator();
  const like = await prisma.likes.create({
    data: {
      id: id.toString(),
      user_id,
      post_id,
    },
  });

  return like;
};

exports.unlikePost = async (prisma, user_id, post_id) => {
  const like = await prisma.likes.deleteMany({
    where: {
      user_id,
      post_id,
    },
  });

  return like;
};

exports.getLikesCount = async (prisma, postId) => {
  const count = await prisma.likes.count({
    where: {
      post_id: postId,
    },
  });

  return count;
};
