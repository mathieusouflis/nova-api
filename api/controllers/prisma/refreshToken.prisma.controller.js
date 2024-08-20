const { PrismaClient } = require("@prisma/client");

exports.isRefreshTokenExist = async (token) => {
  const prisma = new PrismaClient();
  const refresh_token = (await prisma.refresh_tokens.findUnique({
    where: {
      refresh_token: token,
    },
    select: {
      refresh_token: true,
    },
  }))
    ? true
    : false;

  await prisma.$disconnect();
  return refresh_token;
};

exports.createRefreshToken = async (token) => {
  const prisma = new PrismaClient();
  if (this.isRefreshTokenExist(token)) return token;
  try {
    const refresh_token = await prisma.refresh_tokens.create({
      data: {
        refresh_token: token,
      },
    });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
  await prisma.$disconnect();
  return refresh_token;
};

exports.deleteRefreshToken = async (token) => {
  const prisma = new PrismaClient();
  const refresh_token = await prisma.refresh_tokens.delete({
    where: {
      refresh_token: token,
    },
  });
  await prisma.$disconnect();
  return refresh_token;
};
