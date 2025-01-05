import UsersPrismaController from "./prisma/users.prisma.controller.js";

class UserController {
  async user_by_id(req, res) {
    try {
      const { id } = req.params;
      const user = await UsersPrismaController.findUserById(id);

      if (!user) return res.status(404).send("User not found");

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while fetching the user");
    }
  }

  async user_by_ids(req, res) {
    try {
      let { ids } = req.query;
      if (!ids) return res.status(400).send("IDs are not defined");

      ids = ids.split(",");
      const users = [];
      const notFoundIds = [];

      const userPromises = ids.map(async (id) => {
        const user = await UsersPrismaController.findUserById(id);
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
  }

  async user_by_username(req, res) {
    try {
      const { username } = req.params;
      const user = await UsersPrismaController.findUserByUsername(username);
      if (!user) return res.status(404).send("User not found");

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while fetching the user");
    }
  }

  async user_by_usernames(req, res) {
    try {
      let { usernames } = req.query;
      if (!usernames) return res.status(400).send("Usernames are not defined");

      usernames = usernames.split(",");
      const users = [];
      const notFoundUsernames = [];

      const userPromises = usernames.map(async (username) => {
        const user = await UsersPrismaController.findUserByUsername(username);
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
  }

  async delete(req, res) {
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
  }
  // TO DO

  async ban(req, res) {} // TO DO
}

export default new UserController();
