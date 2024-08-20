const { PrismaClient } = require("@prisma/client");

exports.isRefreshTokenExist = async (token) => {
  const prisma = new PrismaClient();
  return (await prisma.refresh_tokens.findUnique({
    wehre: {
      refresh_token: token,
    },
    select: {
      refresh_token: true,
    },
  }))
    ? true
    : false;
};

exports.createRefreshToken = async (token) => {
  const prisma = new PrismaClient();
  if (this.isRefreshTokenExist(token)) return token;
  try {
    return await prisma.refresh_tokens.create({
      data: {
        refresh_token: token,
      },
    });
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

exports.deleteRefreshToken = async (token) => {
  const prisma = new PrismaClient();
  return await prisma.refresh_tokens.delete({
    where: {
      refresh_token: token,
    },
  });
};
