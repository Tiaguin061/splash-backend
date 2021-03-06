import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import IFindAllSponsorshipNotificationsDTO from '@modules/notifications/dtos/IFindAllSponsorshipNotificationsDTO';
import INotificationRepository from '@modules/notifications/repositories/INotificationRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import Notification from '../schemas/Notification';

export default class MongoNotificationRepository
  implements INotificationRepository
{
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  async findAllNotifications(): Promise<Notification[]> {
    const notifications = await this.ormRepository.find({
      order: {
        created_at: 'DESC',
      },
    });

    return notifications;
  }

  async findAllSponsorshipHistoryNotifications({
    recipient_id,
    user_id,
  }: IFindAllSponsorshipNotificationsDTO): Promise<Notification[]> {
    const notifications = await this.ormRepository.find({
      where: {
        recipient_id,
        user_id,
      },
      order: {
        created_at: 'DESC',
      },
    });
    return notifications;
  }

  async findAllNotificationsByUser(
    recipient_id: string,
  ): Promise<Notification[]> {
    const notifications = await this.ormRepository.find({
      where: {
        recipient_id,
      },
      order: {
        created_at: 'DESC',
      },
    });

    return notifications;
  }

  async create({
    content,
    recipient_id,
    user_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
      user_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }

  async sendNotificationPushForAndroid(): Promise<void> {}
}
