export class User {
  private readonly _id: string;
  private _email: string | undefined;
  private _firstName: string;
  private _lastName: string;

  constructor(id: string, firstName: string, lastName: string) {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
  }

  roles: string[] = [];
  phoneNumber: string | null | undefined;
  dateOfBirth: string | null | undefined;

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get firstName() {
    return this.capitalize(this._firstName);
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName() {
    return this.capitalize(this._lastName);
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get initials(): string {
    return `${this._firstName[0]}${this._lastName[0]}`.toUpperCase();
  }

  get fullName(): string {
    return `${this.capitalize(this._firstName)} ${this.capitalize(
      this._lastName
    )}`;
  }

  /**
   * Configure to retrive this DateTimeFormat options from user settings or something *******
   */
  // get formattedDateOfBirth(): string {
  //   if (!this.dateOfBirth) return 'Not provided';
  //   return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
  //     this.dateOfBirth
  //   );
  // }

  // updateProfileDetails(phoneNumber: string, dateOfBirth: Date): void {
  //   this.phoneNumber = phoneNumber;
  //   this.dateOfBirth = dateOfBirth;
  // }

  updateEmail(newEmail: string): void {
    this._email = newEmail;
  }

  private capitalize(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
