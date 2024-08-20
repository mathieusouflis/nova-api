const jwt = require("jsonwebtoken");
const { read } = require("./database.controller");
require("dotenv").config();

exports.generate_token = (data, type) => {
  const secret =
    type === "access" ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET;
  return jwt.sign(data, secret, { expiresIn: "1h" });
};

exports.refresh_token = (req, res) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  const data = read("refreshtokens");

  if (!token || !data.includes(token)) return res.status(401).end();

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).end();
    const accessToken = this.generate_token(user, "access");
    res
      .json({
        token: accessToken,
      })
      .status(200)
      .end();
  });
}; // TO DO
