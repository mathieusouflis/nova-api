const { read, write } = require("./database.controller");
const {
  getPostById,
  createPost,
  queryPosts,
} = require("./prisma/post.prisma.controller");

exports.get_single_post = async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).end();

  const post = await getPostById(id);

  if (!post) return res.status(403).send("Post not found");

  res.status(200).json(post);
};

exports.get_many_posts = (req, res) => {
  let { ids } = req.query;
  if (!ids) return res.status(403).send("Ids's not defined.");
  ids = ids.split(",");

  let posts = [];
  let not_founds = [];

  ids.forEach((id) => {
    const post = getPostById(id);
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

  if (!text) return res.status(400).end();

  const post = await createPost(user.id, text, conversation);

  res.json(post).status(201).end();
};

exports.delete = (req, res) => {
  const { id } = req.params;
  const data = read("posts");
  const post = data[id];

  if (!post) return res.status(404).end();
  if (post.author_id !== req.user.id) return res.status(401).end();

  delete data[id];

  write("posts", data);

  res.status(200).end();
}; // TO DO

exports.query = async (req, res) => {
  const {
    max_results,
    start_time,
    end_time,
    since_id,
    until_id,
    user_id,
    conversation_id,
  } = req.query;

  const returned_post_number =
    max_results && max_results !== "0" ? parseInt(max_results) : 100;
  const returned_posts = await queryPosts(
    returned_post_number,
    start_time,
    end_time,
    since_id,
    until_id,
    user_id,
    conversation_id,
  );
  return res.json({ posts: returned_posts }).status(200);
};
