import { AlertTypeEnum } from '../enums/alert-type.enum';

export interface AlertInterface {
  type: AlertTypeEnum;
  title: string;
  text: string;
}
