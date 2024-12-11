import { inject, Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { NotificationType } from '../enums/notification-type.enum';
import { UNKNOWN_ERROR } from '../constants/unknown-error';
import { HTTP_ERROR_MESSAGES } from '../constants/http-error-messages';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private alertService = inject(AlertService);

  private notificationTypes = NotificationType;

  handle(error: any): void {
    console.log('ERROR', error);
    if (error?.error?.title) {
      this.alertService.showAlert(
        this.notificationTypes.danger,
        error.error.title,
        `${error.error.detail} (${error.status})`,
        error.error.errors!
      );
    } else {
      const httpError = this.handleHttpError(error);

      const title = httpError.title;
      const message = httpError.message;

      this.alertService.showAlert(
        this.notificationTypes.danger,
        title,
        `${message} (${error.status})`
      );
    }
  }

  private handleHttpError(error: { status: number }): {
    title: string;
    message: string;
  } {
    const defaultError = {
      title: UNKNOWN_ERROR.title,
      message: UNKNOWN_ERROR.message,
    };

    return HTTP_ERROR_MESSAGES[error.status] || defaultError;
  }
}
