const { read } = require("./database.controller");

exports.user_by_id = (req, res) => {
  const { id } = req.params;
  let data = read("users");
  const user = data[id];

  if (!user) return res.status(403).send("User not found");

  delete user["password"];
  res.status(200).json(user);
};

exports.user_by_ids = (req, res) => {
  let { ids } = req.query;
  if (!ids) return res.status(404).send("Ids's not defined");
  ids = ids.split(",");

  const data = read("users");
  let users = [];
  let not_founds = [];

  ids.forEach((id) => {
    const user = data[id];
    if (user) {
      delete user.password;
      users.push(data[id]);
    } else {
      not_founds.push(id);
    }
  });

  users.length > 0
    ? res.status(200).json({
        users,
        not_founds,
      })
    : res.status(402).send("Users not found");
};

exports.user_by_username = (req, res) => {
  const { username } = req.params;
  const data = read("users");

  for (const user in data) {
    if (data[user].username === username) {
      delete data[user].password;
      res.status(200).json(data[user]);
      return;
    }
  }
  res.status(404).send("User not found.");
};

exports.user_by_usernames = (req, res) => {
  let { usernames } = req.query;
  if (!usernames) return res.status(404).send("Usernames's not defined.");
  usernames = usernames.split(",");

  const data = read("users");
  let users = [];
  let not_founds = [];

  usernames.forEach((username) => {
    let found = false;
    for (const user in data) {
      if (data[user].username === username) {
        delete data[user].password;
        users.push(data[user]);
        found = true;
        break;
      }
    }
    if (!found) not_founds.push(username);
  });

  users.length > 0
    ? res.status(200).json({
        users,
        not_founds,
      })
    : res.status(402).send("Users not found");
};

exports.delete = (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id) return res.status(403).end();

  const data = read("users");
  if (!data[id]) return res.status(404).end();

  delete data[id];

  write("users", data);
  res.status(200).end();
};

exports.ban = (req, res) => {};
