const { PrismaClient } = require("@prisma/client");

exports.isUsernameTaken = async (username) => {
  const prisma = new PrismaClient();
  const user = await prisma.users.findUnique({
    where: {
      username,
    },
    select: {
      username: true,
    },
  });
  await prisma.$disconnect();
  return user ? true : false;
};

exports.isEmailTaken = async (email) => {
  const prisma = new PrismaClient();
  const user = await prisma.users.findUnique({
    where: { email },
    select: { email: true },
  });

  await prisma.$disconnect();
  return user ? true : false;
};
