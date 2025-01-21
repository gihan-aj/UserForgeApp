import { Injectable } from '@angular/core';
import { PagedList } from '../../shared/models/paged-list.interface';
import { UserDetails } from '../models/user-details.interface';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { SortOrder } from '../../shared/enums/sort-order.enum';
import {
  PAGE,
  PAGE_SIZE,
  SEARCH_TERM,
  SORT_COLUMN,
  SORT_ORDER,
} from '../../shared/constants/query-parameters';
import { UserManagementService } from '../services/user-management.service';

@Injectable()
export class UsersResolver implements Resolve<PagedList<UserDetails>> {
  url: string = `${environment.baseUrl}/api/v1/categories`;

  constructor(private service: UserManagementService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PagedList<UserDetails>> {
    const page = route.queryParamMap.get(PAGE) || '1';
    const pageSize =
      route.queryParamMap.get(PAGE_SIZE) || environment.defaultPageSize;
    const sortOrder =
      route.queryParamMap.get(SORT_ORDER) || SortOrder.ascending;
    const sortColumn = route.queryParamMap.get(SORT_COLUMN) || '';
    const searchTerm = route.queryParamMap.get(SEARCH_TERM) || '';

    return this.service.fetchDataSet(
      +page,
      +pageSize,
      sortColumn,
      sortOrder,
      searchTerm
    );
  }
}
