import { Messages } from '../types/messages.type';

export const MESSAGES: Messages = {
  user: {
    notifications: {
      success: {
        loggedIn: 'Welcome! {firstName} {lastName}',
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
    confirmations: {
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
