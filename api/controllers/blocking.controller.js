class BlockController {
  lookup = (req, res) => {
    try {
      const baseUrl = req.baseUrl.split("/");
      const user_id = baseUrl[baseUrl.length - 2];

      if (user_id !== req.user.id) {
        return res.status(403).send("Forbidden");
      }

      const data = read("blocks");
      const blocking_list = data
        .filter((follow) => follow["blocker"] === user_id)
        .map((follow) => follow["blocked"]);

      return res.status(200).json(blocking_list);
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred during lookup");
    }
  };

  block = (req, res) => {
    try {
      const baseUrl = req.baseUrl.split("/");
      const author_id = baseUrl[baseUrl.length - 2];
      const { targeted_user_id } = req.body;

      if (req.user.id !== author_id || req.user.id === targeted_user_id) {
        return res.status(403).send("Forbidden");
      }

      const users_data = read("users");
      if (!users_data[targeted_user_id]) {
        return res.status(404).send("User not found");
      }

      const blocks_data = read("blocks");

      const alreadyBlocked = blocks_data.some(
        (block) =>
          block["blocker"] === author_id &&
          block["blocked"] === targeted_user_id,
      );

      if (alreadyBlocked) {
        return res.status(409).send("User is already blocked");
      }

      blocks_data.push({
        blocker: author_id,
        blocked: targeted_user_id,
      });

      write("blocks", blocks_data);
      return res.status(201).send("User blocked");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred during blocking");
    }
  };

  unblock = (req, res) => {
    try {
      const baseUrl = req.baseUrl.split("/");
      const author_id = baseUrl[baseUrl.length - 2];
      const { targeted_user_id } = req.params;

      if (author_id !== req.user.id) {
        return res.status(403).send("Forbidden");
      }

      const users_data = read("users");
      if (!users_data[targeted_user_id]) {
        return res.status(404).send("User not found");
      }

      const blocks_data = read("blocks");
      const blockIndex = blocks_data.findIndex(
        (block) =>
          block.blocker === author_id && block.blocked === targeted_user_id,
      );

      if (blockIndex === -1) {
        return res.status(404).send("Block not found");
      }

      blocks_data.splice(blockIndex, 1);
      write("blocks", blocks_data);

      return res.status(200).send("User unblocked");
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred during unblocking");
    }
  };
}

export default new BlockController();
