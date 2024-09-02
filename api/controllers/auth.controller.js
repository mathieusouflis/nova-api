import bcrypt from "bcryptjs";
const { compare, hashSync, genSaltSync } = bcrypt;
import TokenController from "./token.controller.js";
import id_generator from "../../utils/functions/id.js";
import validateEmail from "../validators/email.validator.js";
import validatePassword from "../validators/password.validator.js";
import validateUsername from "../validators/username.validator.js";
import UserController from "./prisma/users.prisma.controller.js";
import RefreshTokenPrismaController from "./prisma/refreshToken.prisma.controller.js";
import dotenv from "dotenv";
dotenv.config();

class AuthController {
  async login(req, res) {
    let { email, password } = req.body;

    try {
      const user = await UserController.findUserByEmailAndPassword(email);
      if (!user) return res.status(404).send("User not found");
      if (!(await compare(password, user.password))) {
        return res.status(401).send("Invalid credentials");
      }

      const user_data = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      let refresh_token = TokenController.generate_token(user_data, "refresh");
      refresh_token =
        await RefreshTokenPrismaController.createRefreshToken(refresh_token);
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "dev" ? false : true,
        sameSite: "None",
        expires: new Date(Date.now() + 60 * 60 * 24 * 60 * 1000), // Durée de vie de 2 mois
      });

      return res.status(200).json({
        access_token: TokenController.generate_token(user_data, "access"),
        id: user.id,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred during login");
    }
  }

  async register(req, res) {
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

      await UserController.createUser(id, email, password, username);

      return res.status(201).send("User created.");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred during registration");
    }
  }

  async logout(req, res) {
    const { refresh_token } = req.body;

    try {
      if (!refresh_token) {
        return res.status(401).send("Missing refresh token");
      }

      if (
        !(await RefreshTokenPrismaController.isRefreshTokenExist(refresh_token))
      ) {
        return res.status(404).send("Token not found.");
      }
      res.clearCookie("refresh_token");
      return res.status(200).send("Logged out");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred during logout");
    }
  }
}

export default new AuthController();
