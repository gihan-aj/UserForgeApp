export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  phoneNumber?: string;
  dateOfBirth?: Date;
}
