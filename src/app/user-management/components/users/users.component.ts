import { Component, inject, OnInit } from '@angular/core';
import { UserManagementService } from '../../services/user-management.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ConfirmationService } from '../../../shared/services/confirmation.service';
import { ErrorHandlingService } from '../../../shared/services/error-handling.service';
import { environment } from '../../../../environments/environment';
import { SortOrder } from '../../../shared/enums/sort-order.enum';
import { GenericDataSource } from '../../../shared/models/generic-data-source.model';
import { UserDetails } from '../../models/user-details.interface';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    MatButtonModule,
    MatIconModule,
    TableComponent,
    MatPaginatorModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  private userManagementService = inject(UserManagementService);
  private errorHandling = inject(ErrorHandlingService);

  constructor(
    private alertService: AlertService,
    private confirmationService: ConfirmationService
  ) {}

  cellHeaders = [
    'id',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'dateOfBirth',
    'isActive',
  ];

  columnsToBeDisplayed = [
    'select',
    'email',
    'firstName',
    'lastName',
    'phoneNumber',
    'dateOfBirth',
    'isActive',
    'actions',
  ];

  page: number = 1;
  pageSize: number = environment.defaultPageSize;
  pageSizeOptions = environment.pageSizeOptions;
  sortByOptions = ['id', 'firstname', 'lastName', 'email', 'phoneNumber'];
  searchTerm: string = '';
  sortOrder: SortOrder = SortOrder.ascending;
  sortBy = this.sortByOptions[0];

  dataSource: GenericDataSource<UserDetails> =
    new GenericDataSource<UserDetails>(
      this.userManagementService,
      this.errorHandling
    );

  fetch() {
    this.dataSource.loadData(
      this.page,
      this.pageSize,
      this.sortBy,
      this.sortOrder,
      this.searchTerm
    );
  }

  getSearchTerm(str: string) {
    this.searchTerm = str;
    this.fetch();
  }

  getSortBy(str: string) {
    this.sortBy = str;
    this.fetch();
  }

  getSortOrder(str: SortOrder) {
    this.sortOrder = str;
    this.fetch();
  }

  pageChanged(e: PageEvent) {
    this.page = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.fetch();
  }

  ngOnInit(): void {
    this.fetch();
  }
}
