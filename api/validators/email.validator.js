import ValidationPrismaController from "../controllers/prisma/validation.prisma.controller.js";

export default async function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return [false, "L'adresse email n'est pas valide. (exemple@domain.com)"];
  } else if (await ValidationPrismaController.isEmailTaken(email)) {
    return [false, "Email déjà utilisée."];
  } else {
    return [true];
  }
}
