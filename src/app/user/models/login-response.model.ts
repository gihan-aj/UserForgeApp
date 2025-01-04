import { UserResponse } from './user-response.model';
import { UserSettings } from './user-settings.interface';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
  userSettings: UserSettings;
}
