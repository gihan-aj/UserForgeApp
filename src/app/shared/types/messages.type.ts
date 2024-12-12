export type Messages = {
  user: {
    notifications: {
      success: {
        loggedIn: string;
        created: string;
        updated: string;
      };
      info: {
        alreadyLoggedIn: string;
      };
      warning: {
        loginFailed: string;
      };
      danger: {
        loginFailed: string;
      };
    };
    confirmations: {
      titles: {
        logout: string;
      };
      messages: {
        logout: string;
      };
      actions: {
        logout: string;
      };
    };
    alerts: {
      titles: {
        registration: string;
      };
      messages: {
        registration: string;
      };
    };
    validations: {
      registration: {
        firstName: {
          required: string;
          minLength: string;
          maxLength: string;
        };
        lastName: {
          required: string;
          minLength: string;
          maxLength: string;
        };
        email: {
          required: string;
          invalid: string;
        };
        phoneNumber: {
          invalid: string;
        };
        dateOfBirth: {
          invalidAge: string;
          invalidFormat: string;
          genericError: string;
        };
        password: {
          required: string;
          minLength: string;
          maxLength: string;
          requireDigit: string;
          requireLowercase: string;
          requireUppercase: string;
          requireNonAlphanumeric: string;
        };
        confirmPassword: {
          required: string;
          passwordMismatch: string;
        };
      };
    };
  };
};
