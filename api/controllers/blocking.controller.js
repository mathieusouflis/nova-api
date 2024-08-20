const { read, write } = require("./database.controller");

exports.lookup = (req, res) => {
  const baseUrl = req.baseUrl.split("/");
  const user_id = baseUrl[baseUrl.length - 2];

  if (user_id !== req.user.id) return res.send(403);

  const data = read("blocks");
  const blocking_list = [];
  data.forEach((follow) => {
    if (follow["blocker"] === user_id) {
      blocking_list.push(follow["blocked"]);
    }
  });

  res.status(200).json(blocking_list);
};

exports.block = (req, res) => {
  const baseUrl = req.baseUrl.split("/");
  const author_id = baseUrl[baseUrl.length - 2];
  const { targeted_user_id } = req.body;

  if (req.user.id !== author_id || req.user.id === targeted_user_id)
    return res.status(403).end();

  const users_data = read("users");
  if (!users_data[targeted_user_id]) return res.status(404).end();

  const blocks_data = read("blocks");

  for (block in blocks_data) {
    if (
      blocks_data[block]["blocker"] === author_id &&
      blocks_data[block]["blocked"] === targeted_user_id
    ) {
      return res.status(402);
    }
  }
  blocks_data.push({
    blocker: author_id,
    blocked: targeted_user_id,
  });

  write("blocks", blocks_data);
  res.status(200).end();
};

exports.unblock = (req, res) => {
  const baseUrl = req.baseUrl.split("/");
  const author_id = baseUrl[baseUrl.length - 2];
  const { targeted_user_id } = req.params;

  if (author_id !== req.user.id) return res.status(403).end();

  const users_data = read("users");
  if (!users_data[targeted_user_id]) return res.status(404).end();

  const blocks_data = read("blocks");

  for (let i = 0; i < blocks_data.length; i++) {
    const block = blocks_data[i];
    if (block.blocker === author_id && block.blocked === targeted_user_id) {
      const new_data = blocks_data.slice(0, i);

      new_data.push(...blocks_data.slice(i + 1, blocks_data.length));
      write("blocks", new_data);

      return res.status(200).end();
    }
  }

  res.status(404).end();
};
