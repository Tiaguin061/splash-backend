import Notification from '../infra/typeorm/schemas/Notification';
import INotificationsRepository from '../repositories/INotificationsRepository';

export default class ListGroupedSponsorshipNotificationsService {
  constructor(private notificationsRepository: INotificationsRepository) {}

  async execute(user_id: string): Promise<Notification[]> {
    const notifications =
      await this.notificationsRepository.findAllNotificationsByUser(user_id);

    const senders: string[] = [];
    const groupedNotifications = notifications.filter(notification => {
      const sender_id = senders.find(
        sender => sender === notification.sender_id,
      );
      if (sender_id) return false;
      senders.push(notification.sender_id);

      return true;
    });

    return groupedNotifications;
  }
}