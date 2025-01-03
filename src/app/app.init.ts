import { inject } from '@angular/core';
import { UserService } from './user/services/user.service';

export function appInitializer() {
  const userService = inject(UserService);
  return () => {
    return new Promise<void>((resolve) => {
      console.log('App initialization started');
      const refreshToken = userService.getRefreshToken();
      console.log('Refresh token:', refreshToken);
      if (refreshToken) {
        userService.refreshAccessToken(refreshToken).subscribe({
          next: () => {
            console.log('Refresh token success');
            resolve();
          },
          error: (error) => {
            console.error('Refresh token error:', error);
            resolve();
          },
        });
      } else {
        console.log('No refresh token found');
        resolve();
      }
    });
  };
}
