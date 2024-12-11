import { Injectable } from '@angular/core';
import { MESSAGES } from '../constants/messages';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  getMassage(
    feature: string,
    category: string,
    type: string,
    key: string,
    params?: Record<string, string>
  ): string {
    let message: any =
      MESSAGES[feature]?.[category]?.[type]?.[key] || 'Message not found';

    if (params) {
      Object.keys(params).forEach((key) => {
        const placeholder = `{${key}}`;
        message = message.replace(placeholder, params[key]);
      });
    }

    return message;
  }
}
