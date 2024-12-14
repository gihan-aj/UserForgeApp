export class User {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public roles: string[],
    public phoneNumber?: string,
    public dateOfBirth?: Date
  ) {}

  get fullName(): string {
    return `${this.capitalize(this.firstName)} ${this.capitalize(
      this.lastName
    )}`;
  }

  /**
   * Configure to retrive this DateTimeFormat options from user settings or something *******
   */
  get formattedDateOfBirth(): string {
    if (!this.dateOfBirth) return 'Not provided';
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
      this.dateOfBirth
    );
  }

  private capitalize(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
