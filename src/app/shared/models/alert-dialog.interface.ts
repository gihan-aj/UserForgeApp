import { NotificationType } from '../enums/notification-type.enum';

export interface AlertDialog {
  type: NotificationType;
  title: string;
  text: string;
  details: string[];
}
