export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  phoneNumber: string | null | undefined;
  dateOfBirth: Date | null | undefined;
}
