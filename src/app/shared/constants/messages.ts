import { Messages } from '../types/messages.type';

export const MESSAGES: Messages = {
  user: {
    notifications: {
      success: {
        loggedIn: 'Welcome! {firstName} {lastName}',
        created: 'User with email: {email}, was successfully created.',
        updated: 'User details updated sucessfully.',
        userUpdated: 'Your user profile has been updated successfully.',
        userSettingsUpdated: 'User settings updated successfully.',
      },
      info: {
        alreadyLoggedIn: 'You have already logged in.',
      },
      warning: {
        loginFailed: 'You have to login first',
      },
      danger: {
        loginFailed: 'Access denied. You have to login again',
        userProfileRetrievalFailed:
          'User profile retrieval failed. Please login again.',
        userUpdateFailed: 'User profile update failed.',
        retrieveUserSettingsFailed: 'User settings retrieval failed.',
        userSettingsUpdateFailed: 'User settings update failed.',
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
    alerts: {
      success: {
        titles: {
          registrationSuccess: 'Account Created',
          emailConfirmed: 'Email Confirmed!',
          emailConfirmationLinkResent: 'Email Resent!',
          passwordResetLinkSent: 'Email sent!',
          passwordResetSuccessful: 'Password is reset!',
          userUpdated: 'User Updated!',
        },
        messages: {
          registrationSuccess:
            'Please check your inbox to confirm your account.',
          emailConfirmed: 'Your email has been successfully confirmed.',
          emailConfirmationLinkResent:
            'Email confirmation link resent. Please check your inbox.',
          passwordResetLinkSent:
            'Password reset link sent. Please check your inbox.',
          passwordResetSuccessful: 'You can login with the new password now.',
          userUpdated: 'Your user profile has been updated successfully.',
        },
      },
      danger: {
        titles: {
          registrationFailed: 'Account Creation Failed!',
          emailConfirmationTokenError: 'Invalid Request!',
          emailConfirmationFailed: 'Email Confirmation Failed!',
          passwordResetTokenError: 'Invalid Request!',
          passwordResetFailed: 'Passward Reset Failed!',
        },
        messages: {
          registrationFailed: '',
          emailConfirmationTokenError:
            'Your request is invalid. Please try again with a new request.',
          emailConfirmationFailed: '',
          passwordResetTokenError:
            'Your request is invalid. Please try again with a new request.',
          passwordResetFailed: 'Please try again later.',
        },
      },
    },
    validations: {
      registration: {
        firstName: {
          required: 'First name is required.',
          minLength:
            'First name must be at least {firstNameMinLnegth} characters long.',
          maxLength:
            'First name must be maximum {firstNameMaxLnegth} characters long.',
        },
        lastName: {
          required: 'Last name is required.',
          minLength:
            'Last name must be at least {lastNameMinLnegth} characters long.',
          maxLength:
            'Last name must be maximum {lastNameMaxLnegth} characters long.',
        },
        email: {
          required: 'Email is required.',
          invalid: 'Email is invalid',
        },
        phoneNumber: {
          invalid: 'Phoen number is invalid',
        },
        dateOfBirth: {
          invalidAge: 'You must be at least {minAge} years old.',
          invalidFormat: 'Please enter a valid date in MM/DD/YYYY format.',
          genericError: 'Invalid date of birth.',
        },
        password: {
          required: 'Password is required.',
          minLength:
            'Password must be at least {passwordMinLength} characters long.',
          maxLength:
            'Password must be maximum {passwordMaxLength} characters long.',
          requireDigit: 'Password must contain at least one digit.',
          requireLowercase:
            'Password must contain at least one lowercase letter',
          requireUppercase:
            'Password must contain at least one uppercase letter',
          requireNonAlphanumeric:
            'Password must contain at least one non-alphanumeric character.',
        },
        confirmPassword: {
          required: 'Confirm Password is required',
          passwordMismatch: 'Password mismatch',
        },
      },
    },
  },
};
