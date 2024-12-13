import { Component, OnInit } from '@angular/core';
import { ErrorHandlingService } from '../shared/services/error-handling.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(private errorHandling: ErrorHandlingService) {}

  callingName = '';

  ngOnInit(): void {
    // this.authService.refreshToken();
    this.getUserprofile();
  }

  getUserprofile() {}
}
