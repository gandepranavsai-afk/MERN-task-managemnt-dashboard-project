import { Notification } from "../models/Notification.js";

export const createNotification = async (userId, type, message, link = "") => {
  const notification = await Notification.create({ user: userId, type, message, link });
  return notification;
};
