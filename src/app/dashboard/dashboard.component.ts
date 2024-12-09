import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account/account.service';
import { ErrorHandlingService } from '../shared/services/error-handling.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private errorHandling: ErrorHandlingService
  ) {}

  callingName = '';

  ngOnInit(): void {
    // this.authService.refreshToken();
    this.getUserprofile();
  }

  getUserprofile() {
    this.accountService.getUserProfile().subscribe({
      next: (response) => {
        this.callingName = response.lastName;
        console.log(response);
      },
      error: (error) => {
        this.errorHandling.handle(error);
      },
    });
  }
}
