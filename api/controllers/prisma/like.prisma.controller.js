const { PrismaClient } = require("@prisma/client");
const { id_generator } = require("../../../utils/functions/id");
exports.likedPost = async (user_id) => {
  const prisma = new PrismaClient();
  return await prisma.likes.findMany({
    where: {
      user_id, // Ensure user_id is an integer
    },
    select: {
      post_id: true,
    },
  });
};

exports.likingUsers = async (post_id) => {
  const prisma = new PrismaClient();
  return await prisma.likes.findMany({
    where: {
      post_id,
    },
    select: {
      user_id: true,
    },
  });
};

exports.likeExist = async (user_id, post_id) => {
  const prisma = new PrismaClient();
  return (await prisma.likes.findFirst({
    where: {
      post_id,
      user_id,
    },
  }))
    ? true
    : false;
};

exports.likePost = async (user_id, post_id) => {
  const prisma = new PrismaClient();
  const id = await id_generator();
  return await prisma.likes.create({
    data: {
      id: id.toString(),
      user_id,
      post_id,
    },
  });
};

exports.unlikePost = async (user_id, post_id) => {
  const prisma = new PrismaClient();
  return await prisma.likes.deleteMany({
    where: {
      user_id,
      post_id,
    },
  });
};
