import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DataValidationService } from '../../../shared/services/data-validation.service';
import { MessageService } from '../../../shared/services/message.service';
import { UserSettings } from '../../models/user-settings.interface';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationType } from '../../../shared/enums/notification-type.enum';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { CommonModule } from '@angular/common';
import { THEMES } from '../../../shared/constants/themes';
import { FormatHeaderPipe } from '../../../shared/pipes/format-header.pipe';
import { DATE_FORMATS } from '../../../shared/constants/date-formats';
import { TIME_FORMATS } from '../../../shared/constants/time-formats';
import { TIME_ZONES } from '../../../shared/constants/time-zones';
import { LANGUAGES } from '../../../shared/constants/languages';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    FormatHeaderPipe,
  ],
  templateUrl: 'user-settings.component.html',
  styleUrl: 'user-settings.component.scss',
})
export class UserSettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dataValidation = inject(DataValidationService);
  public messageService = inject(MessageService);

  userSettings: UserSettings = {
    theme: THEMES.dark,
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'HH:mm',
    timeZone: 'UTC',
    notificationsEnabled: true,
    emailNotification: true,
    smsNotification: true,
    language: 'en',
  };

  themes = Object.values(THEMES);
  dateFormats = Object.values(DATE_FORMATS);
  timeFormats = Object.values(TIME_FORMATS);
  timeZones = Object.values(TIME_ZONES);
  languages = Object.values(LANGUAGES);

  form = this.fb.group({
    theme: [this.userSettings?.theme],
    dateFormat: [this.userSettings?.dateFormat],
    timeFormat: [this.userSettings?.timeFormat],
    timeZone: [this.userSettings?.timeZone],
    notificationsEnabled: [this.userSettings?.notificationsEnabled],
    emailNotification: [this.userSettings?.emailNotification],
    smsNotification: [this.userSettings?.smsNotification],
    language: [this.userSettings?.language],
  });

  isSubmitted: boolean = false;
  isRequestPending: boolean = false;

  user: User | null | undefined;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private errorHandling: ErrorHandlingService
  ) {
    const user = userService.getUser();
    if (user) {
      this.userSettings.theme = user.userSettings?.theme;
      this.userSettings.dateFormat = user.userSettings?.dateFormat;
      this.userSettings.timeFormat = user.userSettings?.timeFormat;
      this.userSettings.timeZone = user.userSettings?.timeZone;
      this.userSettings.notificationsEnabled =
        user.userSettings?.notificationsEnabled;
      this.userSettings.emailNotification =
        user.userSettings?.emailNotification;
      this.userSettings.smsNotification = user.userSettings?.smsNotification;
      this.userSettings.language = user.userSettings?.language;

      this.user = user;
    }
  }

  get theme() {
    return this.form.get('theme');
  }

  get dateFormat() {
    return this.form.get('dateFormat');
  }

  get timeFormat() {
    return this.form.get('timeFormat');
  }

  get timeZone() {
    return this.form.get('timeZone');
  }

  get notificationsEnabled() {
    return this.form.get('notificationsEnabled');
  }

  get emailNotification() {
    return this.form.get('emailNotification');
  }

  get smsNotification() {
    return this.form.get('smsNotification');
  }

  get language() {
    return this.form.get('language');
  }

  ngOnInit(): void {
    this.getUserSettings();
  }

  private getUserSettings(): void {
    this.userService.getUserSettings().subscribe({
      next: (settings) => {
        this.userSettings = settings;
        console.log(this.userSettings);
        this.initializeForm();

        this.user?.updateUserSettings(settings);
        if (this.user) this.userService.setUser(this.user);
      },
      error: (error) => {
        const message = this.messageService.getMassage(
          'user.notifications.danger.retrieveUserSettingsFailed'
        );
        this.notificationService.showNotification(
          NotificationType.danger,
          message
        );

        this.errorHandling.handle(error);
      },
    });
  }

  initializeForm(): void {
    this.form.setValue({
      theme: this.userSettings.theme,
      dateFormat: this.userSettings.dateFormat,
      timeFormat: this.userSettings.timeFormat,
      timeZone: this.userSettings.timeZone,
      notificationsEnabled: this.userSettings.notificationsEnabled,
      emailNotification: this.userSettings.emailNotification,
      smsNotification: this.userSettings.smsNotification,
      language: this.userSettings.language,
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitted = true;
      this.isRequestPending = true;

      const settings: UserSettings = {
        theme: this.theme?.value,
        dateFormat: this.dateFormat?.value,
        timeFormat: this.timeFormat?.value,
        timeZone: this.timeZone?.value,
        notificationsEnabled: this.notificationsEnabled?.value,
        emailNotification: this.emailNotification?.value,
        smsNotification: this.smsNotification?.value,
        language: this.language?.value,
      };

      console.log('form value: ', settings);

      this.userService.updateUserSettings(settings).subscribe({
        next: () => {
          this.isRequestPending = false;
          this.isSubmitted = false;

          const message = this.messageService.getMassage(
            'user.notifications.success.userSettingsUpdated'
          );
          this.notificationService.showNotification(
            NotificationType.success,
            message
          );

          this.getUserSettings();
        },
        error: (error) => {
          this.isRequestPending = false;
          this.isSubmitted = false;

          const message = this.messageService.getMassage(
            'user.notifications.danger.userSettingsUpdateFailed'
          );
          this.notificationService.showNotification(
            NotificationType.danger,
            message
          );

          this.errorHandling.handle(error);
        },
      });
    }
  }
}
