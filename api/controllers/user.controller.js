const {
  findUserById,
  findUserByUsername,
} = require("./prisma/users.prisma.controller");

exports.user_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);

    if (!user) return res.status(404).send("User not found");

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while fetching the user");
  }
};

exports.user_by_ids = async (req, res) => {
  try {
    let { ids } = req.query;
    if (!ids) return res.status(400).send("IDs are not defined");

    ids = ids.split(",");
    const users = [];
    const notFoundIds = [];

    const userPromises = ids.map(async (id) => {
      const user = await findUserById(id);
      if (user) {
        users.push(user);
      } else {
        notFoundIds.push(id);
      }
    });

    await Promise.all(userPromises);

    return res.status(200).json({
      users,
      not_found: notFoundIds,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while fetching users");
  }
};

exports.user_by_username = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await findUserByUsername(username);
    if (!user) return res.status(404).send("User not found");

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while fetching the user");
  }
};

exports.user_by_usernames = async (req, res) => {
  try {
    let { usernames } = req.query;
    if (!usernames) return res.status(400).send("Usernames are not defined");

    usernames = usernames.split(",");
    const users = [];
    const notFoundUsernames = [];

    const userPromises = usernames.map(async (username) => {
      const user = await findUserByUsername(username);
      if (user) {
        users.push(user);
      } else {
        notFoundUsernames.push(username);
      }
    });

    await Promise.all(userPromises);

    return res.status(200).json({
      users,
      not_found: notFoundUsernames,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while fetching users");
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) return res.status(403).send("Forbidden");

    const data = read("users");
    if (!data[id]) return res.status(404).send("User not found");

    delete data[id];
    write("users", data);

    return res.status(200).send("User deleted");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while deleting the user");
  }
};
// TO DO

exports.ban = async (req, res) => {}; // TO DO
