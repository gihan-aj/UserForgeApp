import { AlertType } from '../enums/alert-type.enum';

export interface AlertInterface {
  type: AlertType;
  title: string;
  text: string;
  detail: string[];
}
