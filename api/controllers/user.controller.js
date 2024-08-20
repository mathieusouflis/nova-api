const { read } = require("./database.controller");
const {
  findUserById,
  findUserByUsername,
} = require("./prisma/users.prisma.controller");

exports.user_by_id = async (req, res) => {
  const { id } = req.params;
  const user = await findUserById(id);

  if (!user) return res.status(403).send("User not found");

  res.status(200).json(user);
};

exports.user_by_ids = (req, res) => {
  let { ids } = req.query;
  if (!ids) return res.status(404).send("Ids's not defined");
  ids = ids.split(",");

  let users = [];
  let not_founds = [];

  ids.forEach(async (id) => {
    const user = await findUserById(id);
    if (user) {
      users.push(user);
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

exports.user_by_username = async (req, res) => {
  const { username } = req.params;
  const user = await findUserByUsername(username);
  if (!user) return res.status(404).send("User not found.");

  return res.status(200).json(user);
};

exports.user_by_usernames = (req, res) => {
  let { usernames } = req.query;
  if (!usernames) return res.status(404).send("Usernames's not defined.");
  usernames = usernames.split(",");

  let users = [];
  let not_founds = [];

  usernames.forEach(async (username) => {
    const user = await findUserByUsername(username);
    if (!user) {
      not_founds.push(username);
    } else {
      users.push(user);
    }
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
  if (req.user.id !== id) return res.status(403).send("Forbiden").end();

  const data = read("users");
  if (!data[id]) return res.status(404).send("User not found").end();

  delete data[id];

  write("users", data);
  res.status(200).send("User deleted").end();
}; // TO DO

exports.ban = (req, res) => {};
