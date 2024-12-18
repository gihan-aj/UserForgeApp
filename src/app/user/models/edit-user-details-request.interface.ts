export interface EditUserDetailsRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null | undefined;
  dateOfBirth: string | null | undefined;
}
