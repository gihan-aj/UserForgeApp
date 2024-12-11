import {
  Component,
  inject,
  model,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { SortOrder } from '../../shared/enums/sort-order.enum';
import { environment } from '../../../environments/environment.development';
import { TableComponent } from '../../shared/components/table/table.component';
import { GenericDataSource } from '../../shared/models/generic-data-source.model';
import { CategoryInterface } from './category.interface';
import { CategoryConfigurationService } from './category-configuration.service';
import { ErrorHandlingService } from '../../shared/services/error-handling.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../shared/services/alert.service';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PopupType } from '../../shared/enums/popup-type.enum';
import { Popup } from '../../shared/models/popup.interface';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';
import { ConfirmationService } from '../../shared/services/confirmation.service';
import { NotificationType } from '../../shared/enums/notification-type.enum';

@Component({
  selector: 'app-category-configuration',
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent,
    MatButtonModule,
    MatIconModule,
    TableComponent,
    MatPaginatorModule,
  ],
  templateUrl: './category-configuration.component.html',
  styleUrl: './category-configuration.component.scss',
})
export class CategoryConfigurationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private categoryService = inject(CategoryConfigurationService);

  private confirmationService = inject(ConfirmationService);

  private alerService = inject(AlertService);

  private errorHandling = inject(ErrorHandlingService);

  readonly dialog = inject(MatDialog);

  category = model<CategoryInterface>();

  cellHeaders = ['id', 'name', 'description', 'isActive'];

  columnsToBeDisplayed = [
    'select',
    'name',
    'description',
    'isActive',
    'actions',
  ];

  dataSource: GenericDataSource<CategoryInterface> =
    new GenericDataSource<CategoryInterface>(
      this.categoryService,
      this.errorHandling
    );

  page: number = 1;

  pageSize: number = environment.defaultPageSize;

  pageSizeOptions = environment.pageSizeOptions;

  sortByOptions = ['id', 'name'];

  searchTerm: string = '';

  sortOrder: SortOrder = SortOrder.ascending;

  sortBy = this.sortByOptions[0];

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.dataSource.loadData(
      this.page,
      this.pageSize,
      this.sortBy,
      this.sortOrder,
      this.searchTerm
    );
  }

  private openPopup(type: PopupType, data?: CategoryInterface) {
    const popupData: Popup<CategoryInterface> = {
      title:
        type === PopupType.Add
          ? 'Add Category'
          : type === PopupType.Edit
          ? 'Edit Category'
          : 'View Category',

      popupType: type,
      data: data,
    };

    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: popupData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (type === PopupType.Add) {
          this.categoryService.add(result).subscribe({
            next: () => {
              this.alerService.showAlert(
                NotificationType.success,
                'Success',
                'Category was added successfully.'
              );
            },
            error: (error) => {
              this.errorHandling.handle(error);
            },
            complete: () => {
              this.refresh();
            },
          });
        } else if (type === PopupType.Edit) {
          this.categoryService.update(result).subscribe({
            next: () => {
              this.alerService.showAlert(
                NotificationType.success,
                'Success',
                'Category was updated successfully.'
              );
            },
            error: (error) => {
              this.errorHandling.handle(error);
            },
            complete: () => {
              this.refresh();
            },
          });
        }
      }
    });
  }

  addNewCategory() {
    this.openPopup(PopupType.Add);
  }

  getSearchTerm(str: string) {
    this.searchTerm = str;
    this.refresh();
  }

  getSortBy(str: string) {
    this.sortBy = str;
    this.refresh();
  }

  getSortOrder(str: SortOrder) {
    this.sortOrder = str;
    this.refresh();
  }

  pageChanged(e: PageEvent) {
    this.page = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.refresh();
  }

  viewCategory(item: CategoryInterface) {
    this.openPopup(PopupType.View, item);
  }

  editCategory(item: CategoryInterface) {
    this.confirmationService
      .openConfirmationDialog(
        NotificationType.info,
        'Edit Confirmation',
        `Are you sure you want to edit this category
        ?`,
        'Edit'
      )
      .afterClosed()
      .subscribe({
        next: (accepted) => {
          if (accepted) {
            this.openPopup(PopupType.Edit, item);
          }
        },
      });
  }

  activateCategories(items: CategoryInterface[]) {
    const ids = items.map((item) => item.id);
    this.confirmationService
      .openConfirmationDialog(
        NotificationType.info,
        'Activate Confirmation',
        `Are you sure you want to activate ${
          items.length > 1 ? 'these categories' : 'this category'
        }?`,
        'Activate'
      )
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((accepted) => {
          if (accepted) {
            return this.categoryService.activate(ids);
          }

          return [];
        })
      )
      .subscribe({
        next: () => {
          this.alerService.showAlert(
            NotificationType.success,
            'Success',
            `${
              items.length > 1 ? 'Categories were' : 'The category was'
            } successfully activated.`
          );
        },
        error: (error) => {
          this.errorHandling.handle(error);
        },
        complete: () => {
          this.refresh();
        },
      });
  }

  deactivateCategories(items: CategoryInterface[]) {
    const ids = items.map((item) => item.id);
    this.confirmationService
      .openConfirmationDialog(
        NotificationType.info,
        'Deactivate Confirmation',
        `Are you sure you want to deactivate ${
          items.length > 1 ? 'these categories' : 'this category'
        }?`,
        'Deactivate'
      )
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((accepted) => {
          if (accepted) {
            return this.categoryService.deactivate(ids);
          }

          return [];
        })
      )
      .subscribe({
        next: () => {
          this.alerService.showAlert(
            NotificationType.success,
            'Success',
            `${
              items.length > 1 ? 'Categories were' : 'The category was'
            } successfully deactivated.`
          );
        },
        error: (error) => {
          this.errorHandling.handle(error);
        },
        complete: () => {
          this.refresh();
        },
      });
  }

  deleteCategories(items: CategoryInterface[]) {
    const ids = items.map((item) => item.id);
    this.confirmationService
      .openConfirmationDialog(
        NotificationType.danger,
        'Delete Confirmation',
        `Are you sure you want to delete ${
          items.length > 1 ? 'these categories' : 'this category'
        }?`,
        'Delete'
      )
      .afterClosed()
      .subscribe({
        next: (accepted) => {
          if (accepted) {
            this.categoryService.delete(ids).subscribe({
              next: (respone) => {
                console.log(respone);
                this.alerService.showAlert(
                  NotificationType.success,
                  'Success',
                  `${
                    items.length > 1 ? 'Categories were' : 'The category was'
                  } successfully deleted.`
                );
              },
              error: (error) => {
                this.errorHandling.handle(error);
              },
              complete: () => {
                this.refresh();
              },
            });
          }
        },
      });
    // const ids = items.map((item) => item.id);
    // this.confirmationService
    //   .openConfirmationDialog(
    //     NotificationType.danger,
    //     'Delete Confirmation',
    //     `Are you sure you want to delete ${
    //       items.length > 1 ? 'these categories' : 'this category'
    //     }?`,
    //     'Delete'
    //   )
    //   .afterClosed()
    //   .pipe(
    //     takeUntil(this.destroy$),
    //     switchMap((accepted) => {
    //       if (accepted) {
    //         return this.categoryService.delete(ids);
    //       }

    //       return [];
    //     })
    //   )
    //   .subscribe({
    //     next: () => {
    //       this.alerService.showAlert(
    //         NotificationType.success,
    //         'Success',
    //         `${
    //           items.length > 1 ? 'Categories were' : 'The category was'
    //         } successfully deleted.`
    //       );
    //     },
    //     error: (error) => {
    //       this.errorHandling.handle(error);
    //     },
    //     complete: () => {
    //       this.refresh();
    //     },
    //   });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
