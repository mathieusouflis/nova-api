import id_generator from "../../../utils/functions/id.js";
import prisma from "../../../constants/prisma.js";

class NotificationPrismaController {
  async getNotification(user_id) {
    return await prisma.notifications.findMany({
      where: {
        target_id: user_id, // Ensure user_id is an integer
      },
      select: {
        ressource_type: true,
        ressource_id: true,
        author_id: true,
      },
    });
  }

  async createNotification(
    id,
    author_id,
    ressource_type,
    ressource_id,
    target_id,
  ) {
    return await prisma.notifications.create({
      data: {
        id: id.toString(),
        author_id,
        ressource_id,
        ressource_type,
        target_id,
      },
    });
  }
}

export default new NotificationPrismaController();
