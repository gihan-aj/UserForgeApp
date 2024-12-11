import { NotificationType } from '../enums/notification-type.enum';

export interface NotificationSnackbar {
  type: NotificationType;
  message: string;
}
