import { inject, Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { AlertTypeEnum } from '../enums/alert-type.enum';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private alertService = inject(AlertService);

  private alertTypes = AlertTypeEnum;

  handle(error: any): void {
    console.log('ERROR', error);
    if (error?.error?.title) {
      this.alertService.alert(
        this.alertTypes.danger,
        error.error.title,
        `${error.error.detail} (${error.status})`,
        error.error.errors!
      );
    } else {
      let title = 'Unknown Error';
      let message = 'Unidentified error occured';

      switch (error.status) {
        case 0:
          (title = 'Offline'), (message = 'Server connection lost.');
          break;

        case 401:
          (title = 'Unauthorized'),
            (message = 'Please login with valid credentials.');
          break;

        case 403:
          (title = 'Forbidden'),
            (message = 'You have no permission to perform this action.');
          break;

        case 404:
          (title = 'Not Found'),
            (message = 'The resource you are looking was not found.');
          break;
      }

      this.alertService.alert(
        this.alertTypes.danger,
        title,
        `${message} (${error.status})`
      );
    }
  }
}
