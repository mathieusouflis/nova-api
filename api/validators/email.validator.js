const { read } = require("../controllers/database.controller");

const is_email_avalable = (email) => {
  const data = read("users");

  for (const user in data) {
    if (data[user].email === email) {
      return false;
    }
  }
  return true;
};

exports.validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return [false, "L'adresse email n'est pas valide. (exemple@domain.com)"];
  } else if (!is_email_avalable(email)) {
    return [false, "Email déjà utilisée."];
  } else {
    return [true];
  }
};
