import { AlertType } from '../enums/alert-type.enum';

export interface DialogInterface {
  type: AlertType;
  title: string;
  text: string;
  action: string;
}
