import { AlertType } from '../enums/alert-type.enum';

export interface SnackBarInterface {
  type: AlertType;
  text: string;
}
