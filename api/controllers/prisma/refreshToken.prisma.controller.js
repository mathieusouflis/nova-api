const { PrismaClient } = require("@prisma/client");
const { id_generator } = require("../../../utils/functions/id");

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
  if (await this.isRefreshTokenExist(token)) return token;

  const prisma = new PrismaClient();
  try {
    const refresh_token = await prisma.refresh_tokens.create({
      data: {
        id: await id_generator(),
        refresh_token: token,
      },
    });
    console.log(refresh_token);
    await prisma.$disconnect();
    return refresh_token.refresh_token;
  } catch (err) {
    await prisma.$disconnect();
    throw new Error(err);
  }
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
