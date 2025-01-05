import jwt from "jsonwebtoken";
import RefreshTokenPrismaController from "./prisma/refreshToken.prisma.controller.js";
import dotenv from "dotenv";
dotenv.config();

const generate_token = (data, type) => {
  const secret =
    type === "access" ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error("JWT secret not configured");
  }

  const expiresIn = type === "access" ? "1h" : "100y";

  return jwt.sign(data, secret, { expiresIn });
};

class TokenController {
  generate_token(data, type) {
    return generate_token(data, type);
  }

  async refresh_token(req, res) {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return res.status(401).send("Refresh token is required");
      }

      if (
        !(await RefreshTokenPrismaController.isRefreshTokenExist(refreshToken))
      ) {
        return res.status(401).send("Invalid or expired token");
      }

      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
          return res.status(403).send("Invalid refresh token");
        }

        delete user["iat"];
        delete user["exp"];

        const accessToken = generate_token(user, "access");

        return res.status(200).json({ access_token: accessToken });
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send("An error occurred while refreshing the token");
    }
  }
  // TO DO
}

export default new TokenController();
