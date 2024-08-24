const { PrismaClient } = require("@prisma/client");

// USERS

exports.createUser = async (prisma, id, email, password, username) => {
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

exports.findUserByUsername = async (prisma, username) => {
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

exports.findUserById = async (prisma, id) => {
  const user = await prisma.users.findUnique({
    where: {
      id,
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

exports.findUserByEmailAndPassword = async (prisma, email) => {
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
};
