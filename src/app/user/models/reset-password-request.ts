export interface ResetPasswordRequest {
  userId: string | undefined;
  token: string | undefined;
  newPassword: string | undefined;
}
