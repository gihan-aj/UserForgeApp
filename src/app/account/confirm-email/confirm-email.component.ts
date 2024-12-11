import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../account.service';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { AlertType } from '../../shared/enums/alert-type.enum';
import { ErrorHandlingService } from '../../shared/services/error-handling.service';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [RouterLink, MatDividerModule, MatButtonModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent implements OnInit {
  requestPending: boolean = false;
  token: string = '';
  userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private snackBar: SnackBarService,
    private errorHandling: ErrorHandlingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.userId = params['userId'];
    });
  }
  activateAccount() {
    this.requestPending = true;
    this.accountService.activateAccount(this.userId, this.token).subscribe({
      next: () => {
        this.snackBar.showNotification(
          AlertType.success,
          'Account activated. You can login now.'
        );

        this.requestPending = false;

        this.router.navigateByUrl('/account/login');
      },
      error: (error) => {
        this.snackBar.showNotification(
          AlertType.danger,
          'Account activation failed.'
        );

        this.errorHandling.handle(error);

        this.requestPending = false;
      },
    });
  }
}
