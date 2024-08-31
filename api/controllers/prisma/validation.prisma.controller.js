const { PrismaClient } = require("@prisma/client");

const { prisma } = require("../../../constants/prisma.js");

exports.isUsernameTaken = async (username) => {
  const user = await prisma.users.findUnique({
    where: {
      username,
    },
    select: {
      username: true,
    },
  });

  return user ? true : false;
};

exports.isEmailTaken = async (email) => {
  const user = await prisma.users.findUnique({
    where: { email },
    select: { email: true },
  });

  return user ? true : false;
};
