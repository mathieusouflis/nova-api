const { id_generator } = require("../../utils/functions/id");
const { read, write } = require("./database.controller");

exports.get_single_post = (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.sendStatus(400);

  const data = read("posts");

  const post = data[id];

  if (!post) return res.status(403).send("Post not found");

  res.status(200).json(post);
};

exports.get_many_posts = (req, res) => {
  let { ids } = req.query;
  if (!ids) return res.status(403).send("Ids's not defined.");
  ids = ids.split(",");

  const data = read("posts");
  let posts = [];
  let not_founds = [];

  ids.forEach((id) => {
    const post = data[id];
    if (post) {
      posts.push(post);
    } else {
      not_founds.push(id);
    }
  });

  posts.length > 0
    ? res.status(200).json({
        posts,
        not_founds,
      })
    : res.status(402).send("Posts not found");
};

exports.create = async (req, res) => {
  const { text, conversation } = req.body;
  const user = req.user;

  if (!text) return res.sendStatus(400);

  const data = read("posts");
  const id = await id_generator();

  data[id] = {
    id: id.toString(),
    conversation: conversation ? conversation.toString() : id.toString(),
    author_id: user["id"],
    text,
    images: null,
    creation_date: Date.now().toString(),
  };

  write("posts", data);

  res.json(data[id]).status(201).end();
};

exports.delete = (req, res) => {
  const { id } = req.params;
  const data = read("posts");
  const post = data[id];

  if (!post) return res.sendStatus(404);
  if (post.author_id !== req.user.id) return res.sendStatus(401);

  delete data[id];

  write("posts", data);

  res.sendStatus(200);
};

exports.query = (req, res) => {
  const {
    max_results,
    start_time,
    end_time,
    since_id,
    until_id,
    user_id,
    conversation_id,
  } = req.query;

  const data = read("posts");
  const posts = Object.values(data);
  let returned_posts = [];
  const returned_post_number =
    max_results && max_results !== "0" ? parseInt(max_results) : 100;

  for (let post of posts) {
    if (returned_posts.length === returned_post_number) break;

    if (user_id && post.author_id !== user_id) continue;

    if (conversation_id && post.conversation !== conversation_id) continue;

    if (start_time && post.creation_date < start_time) continue;

    if (end_time && post.creation_date > end_time) continue;

    if (since_id && post.id < since_id) continue;

    if (until_id && post.id > until_id) continue;

    returned_posts.push(post);
  }

  // Sort the posts in descending order of creation_date
  returned_posts.sort((a, b) => b.creation_date - a.creation_date);

  return res.json({ posts: returned_posts }).status(200);
};
