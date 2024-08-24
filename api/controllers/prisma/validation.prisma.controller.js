const { PrismaClient } = require("@prisma/client");

exports.isUsernameTaken = async (prisma, username) => {
  const user = await prisma.users.findUnique({
    where: {
      username,
    },
    select: {
      username: true,
    },
  });

  return user ? true : false;
};

  const user = await prisma.users.findUnique({
    where: { email },
    select: { email: true },
  });

  return user ? true : false;
};
