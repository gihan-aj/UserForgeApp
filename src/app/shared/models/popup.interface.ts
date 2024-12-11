import { PopupType } from '../enums/popup-type.enum';

export interface Popup<T> {
  title: string;
  popupType: PopupType;
  data: T | undefined;
}
