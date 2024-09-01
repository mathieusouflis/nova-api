import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function tokenAuthorisation(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;
    next();
  });
}
