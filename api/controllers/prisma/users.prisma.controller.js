import prisma from "../../../constants/prisma.js";

// USERS

class UsersPrismaController {
  async createUser(id, email, password, username) {
    const user = await prisma.users.create({
      data: {
        id,
        role: "Member",
        status: "public",
        email,
        password,
        username,
        creation_date: Date.now().toString(),
      },
    });

    return user;
  }

  async findUserByUsername(username) {
    const user = await prisma.users.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        status: true,
        description: true,
        avatar: true,
        banner: true,
        date_of_birth: true,
        creation_date: true,
      },
    });

    return user;
  }

  async findUserById(id) {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },

      include: {
        _count: {
          select: {
            users_following: true,
            users_followed: true,
          },
        },
        users_followed: true,
        users_following: true,
      },
    });

    return user;
  }

  async findUserByEmailAndPassword(email) {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        username: true,
        role: true,
        password: true,
      },
    });

    return user;
  }
}

export default new UsersPrismaController();
