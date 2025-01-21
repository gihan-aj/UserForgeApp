export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  dateOfBirth: Date | null;
  isActive: boolean;
}
