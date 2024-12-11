import { Injectable } from '@angular/core';
import { MESSAGES } from '../constants/messages';
import { MessagePath } from '../types/message-path.type';
import { Messages } from '../types/messages.type';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messages = MESSAGES;

  /**
   * Retrieves a message by path and formats it with optional placeholders.
   *
   * @param path - The dot-separated path to the message (e.g., 'user.notifications.success.created').
   * @param placeholders - An object with placeholder values to replace in the message template.
   * @returns The formatted message string.
   */
  getMassage(
    path: MessagePath<Messages>,
    placeholders: Record<string, string> = {}
  ): string {
    const keys = path.split('.') as Array<keyof Messages>;
    const template =
      keys.reduce((acc, key) => acc?.[key] as any, this.messages) ||
      'Message not found.';

    return typeof template === 'string'
      ? this.formatMessage(template, placeholders)
      : 'Message not found.';
  }

  private formatMessage(
    template: string,
    placeholders: Record<string, string>
  ): string {
    return template.replace(
      /\{(\w+)\}/g,
      (_, key) => placeholders[key] || `{${key}}`
    );
  }
}
