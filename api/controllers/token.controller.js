const jwt = require("jsonwebtoken");
const { read, write } = require("./database.controller");
require("dotenv").config();

exports.generate_token = (data, type) => {
  const secret =
    type === "access" ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET;
  return jwt.sign(data, secret, { expiresIn: "1h" });
};

exports.generate_test_token = (req, res) => {
  const user = read("users")["0"];
  const accessToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10s",
    },
  );

  const refresh_data = read("refreshtokens");

  const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET);

  if (!refresh_data.includes(refreshToken)) {
    refresh_data.push(refreshToken);
    write("refreshtokens", refresh_data);
  }

  res
    .json({
      token: accessToken,
      refresh_token: refreshToken,
    })
    .sendStatus(200);
};

exports.refresh_token = (req, res) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];
  const data = read("refreshtokens");

  if (!token || !data.includes(token)) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = this.generate_token(user, "access");
    res
      .json({
        token: accessToken,
      })
      .sendStatus(200);
  });
};
