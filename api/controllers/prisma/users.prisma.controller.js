const { PrismaClient } = require("@prisma/client");

// USERS

exports.createUser = async (id, email, password, username) => {
  const prisma = new PrismaClient();
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
};

exports.findUserByUsername = async (username) => {
  const prisma = new PrismaClient();

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
};

exports.findUserByEmailAndPassword = async (email) => {
  const prisma = new PrismaClient();
  return await prisma.users.findUnique({
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
};
