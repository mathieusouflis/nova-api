  getPostById,
  createPost,
  queryPosts,
} = require("./prisma/post.prisma.controller");

exports.get_single_post = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).send("Invalid post ID");

    // const post = await getPostById(req.prisma, req.user, id);
    const post = await getPostById(req.user, id);

    if (!post) return res.status(404).send("Post not found");

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while fetching the post");
  }
};

exports.get_many_posts = async (req, res) => {
  try {
    let { ids } = req.query;
    if (!ids) return res.status(400).send("IDs are not defined");

    ids = ids.split(",");
    const posts = [];
    const notFoundIds = [];

    for (const id of ids) {
      // const post = await getPostById(req.prisma, req.user, id);
      const post = await getPostById(req.user, id);
      if (post) {
        posts.push(post);
      } else {
        notFoundIds.push(id);
      }
    }

    if (posts.length > 0) {
      return res.status(200).json({
        posts,
        not_found: notFoundIds,
      });
    } else {
      return res.status(404).send("No posts found");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while fetching posts");
  }
};

exports.create = async (req, res) => {
  try {
    const { text, conversation } = req.body;
    const user = req.user;

    if (!text) return res.status(400).send("Text is required");

    const post = await createPost(user.id, text, conversation);

    return res.status(201).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while creating the post");
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const data = read("posts");
    const post = data[id];

    if (!post) return res.status(404).send("Post not found");
    if (post.author_id !== req.user.id)
      return res.status(403).send("Forbidden");

    delete data[id];
    write("posts", data);

    return res.status(200).send("Post deleted successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while deleting the post");
  }
};
// TO DO

exports.query = async (req, res) => {
  try {
    const {
      max_results,
      start_time,
      end_time,
      since_id,
      until_id,
      user_id,
      conversation_id,
      is_comment,
    } = req.query;
    const returned_post_number =
      max_results && !isNaN(max_results) ? parseInt(max_results) : 100;


    const returned_posts = await queryPosts(
      req.user,
      returned_post_number,
      start_time,
      end_time,
      since_id,
      until_id,
      user_id,
      conversation_id,
      is_comment,
    );

    return res.status(200).json({ posts: returned_posts });
  } catch (error) {
    console.error(error);
    return res.status(500).send("An error occurred while querying posts");
  }
};
