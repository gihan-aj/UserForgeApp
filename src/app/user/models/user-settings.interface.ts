export interface UserSettings {
  theme: string | null | undefined;
  language: string | null | undefined;
  dateFormat: string | null | undefined;
  timeFormat: string | null | undefined;
  timeZone: string | null | undefined;
  notificationsEnabled: boolean | null | undefined;
  emailNotification: boolean | null | undefined;
  smsNotification: boolean | null | undefined;
}
