import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertTypeEnum } from '../enums/alert-type.enum';
import { AlertComponent } from '../components/alert/alert.component';
import { ActionTypeEnum } from '../enums/action-type.enum';
import { EntityEnum } from '../enums/entity.enum';
import { ErrorInterface } from '../models/error.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  readonly dialog = inject(MatDialog);

  alert(
    type: AlertTypeEnum,
    title: string,
    message: string,
    description: ErrorInterface[] = []
  ): void {
    let errors: string[] = [];
    if (description !== null && description.length > 0) {
      errors = description.map((e) => {
        return e.description;
      });
    }
    const dialogRef = this.dialog.open(AlertComponent, {
      data: { type: type, title: title, text: message, detail: errors },
    });
  }

  // alertSuccess(
  //   entity: EntityEnum,
  //   actionType: ActionTypeEnum,
  //   multipleRecords: boolean = false
  // ) {
  //   const type = AlertTypeEnum.success;

  //   let title: string = 'Success';
  //   switch (actionType) {
  //     case ActionTypeEnum.Add:
  //       title = 'Added';
  //       break;
  //     case ActionTypeEnum.Updated:
  //       title = 'Updated';
  //       break;
  //     case ActionTypeEnum.Activate:
  //       title = 'Activated';
  //       break;
  //     case ActionTypeEnum.Deactivate:
  //       title = 'Deactivated';
  //       break;
  //     case ActionTypeEnum.Deleted:
  //       title = 'Deleted';
  //       break;
  //   }
  // }
}
