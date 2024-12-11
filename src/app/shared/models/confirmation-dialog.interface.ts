import { NotificationType } from '../enums/notification-type.enum';

export interface ConfirmationDialog {
  type: NotificationType;
  title: string;
  text: string;
  action: string;
}
