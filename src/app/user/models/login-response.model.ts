import { UserResponse } from './user-response.model';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}
