const { compare, hashSync, genSaltSync } = require("bcryptjs");
const { decrypt } = require("../../utils/functions/rsa");
const { read, write } = require("./database.controller");
const { generate_token } = require("./token.controller");
const { id_generator } = require("../../utils/functions/id");
const { validateEmail } = require("../validators/email.validator");
const { validatePassword } = require("../validators/password.validator");
const { validateUsername } = require("../validators/username.validator");

exports.login = (req, res) => {
  let { email, password } = req.body;
  console.log(req.body);
  // email = decrypt(email);
  // password = decrypt(password);

  const data = read("users");
  const user = Object.values(data).find((user) => user.email === email);
  if (!user) return res.send(404);
  if (compare(password, user.password)) {
    const user_data = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const refresh_data = read("refreshtokens");

    const refresh_token = generate_token(user_data, "refresh");

    if (!refresh_data.includes(refresh_token)) {
      refresh_data.push(refresh_token);
      write("refreshtokens", refresh_data);
    }

    return res.status(200).json({
      access_token: generate_token(user_data, "access"),
      refresh_token,
    });
  } else {
    return res.sendStatus(401);
  }
};

exports.register = async (req, res) => {
  let { username, email, password } = req.body;
  const errors = {};
  const usernameValidator = validateUsername(username);
  const emailValidator = validateEmail(email);
  const passwordValidator = validatePassword(password);

  if (!usernameValidator[0]) errors["username"] = usernameValidator[1];
  if (!emailValidator[0]) errors["email"] = emailValidator[1];
  if (!passwordValidator[0]) errors["password"] = passwordValidator[1];
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  password = hashSync(password, genSaltSync(10));
  const id = await id_generator();
  const user = {
    id,
    role: "Member",
    status: "public",
    email,
    password,
    username,
    description: null,
    avatar: null,
    banner: null,
    date_of_birth: null,
    creation_date: Date.now().toString(),
  };
  const users_data = read("users");

  users_data[id] = user;

  write("users", users_data);
  res.sendStatus(200);
};

exports.logout = (req, res) => {
  const { refresh_token } = req.body;
  let refreshtokens_data = read("refreshtokens");
  if (!refresh_token || !refreshtokens_data.includes(refresh_token))
    return res.sendStatus(401);

  refreshtokens_data = refreshtokens_data.filter(
    (token) => token !== refresh_token,
  );

  write("refreshtokens", refreshtokens_data);

  res.sendStatus(200);
};
