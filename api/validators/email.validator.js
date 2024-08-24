const {
  isEmailTaken,
} = require("../controllers/prisma/validation.prisma.controller");

exports.validateEmail = async (prisma, email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return [false, "L'adresse email n'est pas valide. (exemple@domain.com)"];
  } else if (await isEmailTaken(prisma, email)) {
    return [false, "Email déjà utilisée."];
  } else {
    return [true];
  }
};
