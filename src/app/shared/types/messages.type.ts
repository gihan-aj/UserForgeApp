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
  };
};
