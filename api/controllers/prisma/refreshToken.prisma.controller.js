import id_generator from "../../../utils/functions/id.js";

import prisma from "../../../constants/prisma.js";

class RefreshTokenPrismaController {
  async isRefreshTokenExist(token) {
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
  }

  async createRefreshToken(token) {
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
  }

  async deleteRefreshToken(token) {
    const refresh_token = await prisma.refresh_tokens.delete({
      where: {
        refresh_token: token,
      },
    });

    return refresh_token;
  }
}

export default new RefreshTokenPrismaController();
