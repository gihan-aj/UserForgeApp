import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snack-bar.service';
import { AlertTypeEnum } from '../enums/alert-type.enum';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(SnackBarService);

  if (authService.currentUserSig()) {
    snackBar.showNotification(
      AlertTypeEnum.info,
      'You have already logged in.'
    );
    router.navigateByUrl('/dashboard');
    return false;
  } else {
    return true;
  }
};
