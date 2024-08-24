const { id_generator } = require("../../../utils/functions/id");

exports.createPost = async (prisma, author_id, text, conversation) => {
  const id = await id_generator();
  const post = await prisma.posts.create({
    data: {
      id: id.toString(),
      conversation: conversation ? conversation.toString() : id.toString(),
      author_id,
      text,
      is_comment: conversation ? true : false,
      creation_date: Date.now().toString(),
    },
  });

  return post;
};

exports.getPostById = async (prisma, id) => {
  console.log("coucou");
  const post = await prisma.posts.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
  return post;
};

exports.queryPosts = async (
  prisma,
  max_results,
  start_time,
  end_time,
  since_id,
  until_id,
  user_id,
  conversation_id,
  is_comment,
) => {
  const posts = await prisma.posts.findMany({
    where: {
      AND: [
        user_id ? { author_id: user_id } : {},
        conversation_id ? { conversation: conversation_id } : {},
        is_comment !== undefined
          ? {
              is_comment:
                is_comment === "true" || is_comment === "1" ? true : false,
            }
          : {},
        start_time ? { creation_date: { gte: new Date(start_time) } } : {},
        end_time ? { creation_date: { lte: new Date(end_time) } } : {},
        since_id ? { id: { gt: since_id } } : {},
        until_id ? { id: { lt: until_id } } : {},
      ],
    },
    take: max_results,
    orderBy: {
      creation_date: "desc",
    },
  });
};
