import { Component, OnInit } from '@angular/core';
import { ProgressBarComponent } from '../../../shared/components/progress-bar/progress-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { CommonModule } from '@angular/common';
import { MESSAGES } from '../../../shared/constants/messages';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, RouterLink, ProgressBarComponent, MatButtonModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private errorHandling: ErrorHandlingService
  ) {}

  isLoading: boolean = true;
  isSuccess: boolean | null = null;

  messages = MESSAGES;

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const userId = this.route.snapshot.queryParamMap.get('userId');

    if (token && userId) {
      this.userService.confirmEmail(userId, token).subscribe({
        next: () => {
          this.isLoading = false;
          this.isSuccess = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.isSuccess = false;

          this.errorHandling.handle(error);
        },
      });
    } else {
      this.isLoading = false;
      this.isSuccess = false;
    }
  }
}
