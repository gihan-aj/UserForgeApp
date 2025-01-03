export interface UserSettings {
  theme: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  timeZone: string;
  notificationsEnabled: boolean | null | undefined;
  emailNotification: boolean | null | undefined;
  smsNotification: boolean | null | undefined;
}
