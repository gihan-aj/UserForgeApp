export const MESSAGES: {
  [feature: string]: {
    [category: string]: {
      [type: string]: {
        [key: string]: string;
      };
    };
  };
} = {
  user: {
    notifications: {
      success: {
        loggedIn: 'Welcome! {lastName}, You have successfully logged in.',
        created: 'User with email: {email}, was successfully created.',
        updated: 'User details updated sucessfully.',
      },
      info: {
        alreadyLoggedIn: 'You have already logged in.',
      },
      warning: {
        loginFailed: 'You have to login first',
      },
      danger: {
        loginFailed: 'Access denied. You have to login again',
      },
    },
    alerts: {
      titles: {
        logout: 'Logout Confirmation',
      },
      messages: {
        logout: 'Are you sure you want to log out ?',
      },
      actions: {
        logout: 'Yes',
      },
    },
  },
};
