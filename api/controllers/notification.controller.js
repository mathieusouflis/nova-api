import id_generator from "../../../utils/functions/id.js";
import prisma from "../../../constants/prisma.js";
import NotificationPrismaController from "./prisma/notification.prisma.controller.js";

class NotificationController {
  async getNotification(req, res) {
    const { user_id } = req.params;

    await NotificationController.getNotification(user_id); // user_id
  }

  async createNotification(req, res) {
    try {
      const { user_id } = req.user;
      const { ressource_id, ressource_type, target_id } = req.body;

      if (!ressource_id || !ressource_type || !target_id)
        return res.status(400).send("Missing parameters");
      const id = id_generator();
      await NotificationController.createNotification(
        id,
        user_id,
        ressource_id,
        ressource_type,
        target_id,
      );
    } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred while creating the post");
    }
  }
}

export default new NotificationController();
