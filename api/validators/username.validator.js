const { read } = require("../controllers/database.controller");

const is_username_avalable = (username) => {
  const data = read("users");

  for (const user in data) {
    if (data[user].username === username) {
      return false;
    }
  }
  return true;
};

exports.validateUsername = (username) => {
  const usernameRegex = /^[A-Za-z0-9_]{2,24}$/;
  if (!usernameRegex.test(username)) {
    return [
      false,
      "Le nom d'utilisateur doit : Contenir que des lettres ainsi que des '_', et faire entre 2 et 24 characters.",
    ];
  } else if (!is_username_avalable(username)) {
    return [false, "Le nom d'utilisateur est déjà pris."];
  } else {
    return [true];
  }
};
