const {
  isUsernameTaken,
} = require("../controllers/prisma/validation.prisma.controller");

exports.validateUsername = async (username) => {
  const usernameRegex = /^[A-Za-z0-9_]{2,24}$/;
  if (!usernameRegex.test(username)) {
    return [
      false,
      "Le nom d'utilisateur doit : Contenir que des lettres ainsi que des '_', et faire entre 2 et 24 characters.",
    ];
  } else if (await isUsernameTaken(username)) {
    return [false, "Le nom d'utilisateur est déjà pris."];
  } else {
    return [true];
  }
};
