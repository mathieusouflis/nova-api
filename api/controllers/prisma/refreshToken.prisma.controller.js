const { id_generator } = require("../../../utils/functions/id");

const { prisma } = require("../../../constants/prisma.js");

exports.isRefreshTokenExist = async (token) => {
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

  return refresh_token;
};

exports.createRefreshToken = async (token) => {
  if (await this.isRefreshTokenExist(token)) return token;

  try {
    const refresh_token = await prisma.refresh_tokens.create({
      data: {
        id: await id_generator(),
        refresh_token: token,
      },
    });

    return refresh_token.refresh_token;
  } catch (err) {
    throw new Error(err);
  }
};

exports.deleteRefreshToken = async (token) => {
  const refresh_token = await prisma.refresh_tokens.delete({
    where: {
      refresh_token: token,
    },
  });

  return refresh_token;
};
