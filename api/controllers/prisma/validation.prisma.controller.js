import prisma from "../../../constants/prisma.js";

class ValidationPrismaController {
  async isUsernameTaken(username) {
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
      },
    });

    return user ? true : false;
  }

  async isEmailTaken(email) {
    const user = await prisma.users.findUnique({
      where: { email },
      select: { email: true },
    });

    return user ? true : false;
  }
}

export default new ValidationPrismaController();
