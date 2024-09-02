import id_generator from "../../../utils/functions/id.js";

import prisma from "../../../constants/prisma.js";

class PostPrismaController {
  async createPost(author_id, text, conversation) {
    const id = await id_generator();
    const post = await prisma.posts.create({
      data: {
        id: id.toString(),
        conversation: conversation ? conversation.toString() : null,
        author_id,
        text,
        is_comment: conversation ? true : false,
        creation_date: Date.now().toString(),
      },
    });

    return post;
  }
  async getPostById(request_author, id) {
    const post = await prisma.posts.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          where: {
            user_id: request_author.id,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
            description: true,
            _count: {
              select: {
                users_followed: {
                  where: {
                    follower: request_author.id,
                  },
                },
              },
            },
          },
        },
      },
    });

    return post;
  }

  async queryPosts(
    request_author,
    max_results,
    start_time,
    end_time,
    since_id,
    until_id,
    user_id,
    conversation_id,
  ) {
    const posts = await prisma.posts.findMany({
      where: {
        AND: [
          user_id ? { author_id: user_id } : {},
          conversation_id && conversation_id === "false"
            ? { conversation: null }
            : conversation_id
              ? { conversation: conversation_id }
              : {},
          start_time ? { creation_date: { gte: new Date(start_time) } } : {},
          end_time ? { creation_date: { lte: new Date(end_time) } } : {},
          since_id ? { id: { gte: since_id } } : {},
          until_id ? { id: { lte: until_id } } : {},
        ],
      },
      take: max_results,
      orderBy: {
        creation_date: "desc",
      },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          where: {
            user_id: request_author.id,
          },
        },
        author: {
          select: {
            id: true,
            username: true,
            description: true,
            _count: {
              select: {
                users_followed: {
                  where: {
                    follower: request_author.id,
                  },
                },
              },
            },
          },
        },
      },
    });

    return posts;
  }
}

export default new PostPrismaController();
