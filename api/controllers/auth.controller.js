const { compare, hashSync, genSaltSync } = require("bcryptjs");
const { generate_token } = require("./token.controller");
const { id_generator } = require("../../utils/functions/id");
const { validateEmail } = require("../validators/email.validator");
const { validatePassword } = require("../validators/password.validator");
const { validateUsername } = require("../validators/username.validator");
const {
  createUser,
  findUserByEmailAndPassword,
} = require("./prisma/users.prisma.controller");
const {
  createRefreshToken,
  isRefreshTokenExist,
} = require("./prisma/refreshToken.prisma.controller");

exports.login = async (req, res) => {
  let { email, password } = req.body;

  try {
    const user = await findUserByEmailAndPassword(email);
    if (!user) return res.status(404).send("User not found");
    if (!(await compare(password, user.password))) {
      return res.status(401).send("Invalid credentials");
    }

    const user_data = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    let refresh_token = generate_token(user_data, "refresh");
    refresh_token = await createRefreshToken(refresh_token);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 100 * 365 * 24 * 60 * 60 * 1000, // Durée de vie de 100 ans
    });

    return res.status(200).json({
      access_token: generate_token(user_data, "access"),
      id: user.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred during login");
  }
};

exports.register = async (req, res) => {
  let { username, email, password } = req.body;
  const errors = {};

  try {
    const usernameValidator = await validateUsername(username);
    const emailValidator = await validateEmail(email);
    const passwordValidator = validatePassword(password);

    if (!usernameValidator[0]) errors["username"] = usernameValidator[1];
    if (!emailValidator[0]) errors["email"] = emailValidator[1];
    if (!passwordValidator[0]) errors["password"] = passwordValidator[1];

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    password = hashSync(password, genSaltSync(10));

    const id = await id_generator();

    await createUser(id, email, password, username);

    return res.status(201).send("User created.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred during registration");
  }
};

exports.logout = async (req, res) => {
  const { refresh_token } = req.body;

  try {
    if (!refresh_token) {
      return res.status(401).send("Missing refresh token");
    }

    if (!(await isRefreshTokenExist(refresh_token))) {
      return res.status(404).send("Token not found.");
    }
    res.clearCookie("refresh_token");
    return res.status(200).send("Logged out");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred during logout");
  }
};
