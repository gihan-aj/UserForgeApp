import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  MaybeAsync,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { PagedList } from '../../shared/models/paged-list.interface';
import { CategoryInterface } from './category.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CategoryConfigurationService } from './category-configuration.service';
import { SortOrder } from '../../shared/enums/sort-order.enum';

@Injectable()
export class CategoryResolver implements Resolve<PagedList<CategoryInterface>> {
  url: string = `${environment.baseUrl}/api/v1/categories`;

  constructor(private service: CategoryConfigurationService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<PagedList<CategoryInterface>> {
    const page = route.queryParamMap.get('page') || '1';
    const pageSize =
      route.queryParamMap.get('pageSize') || environment.defaultPageSize;
    const sortOrder =
      route.queryParamMap.get('sortOrder') || SortOrder.ascending;
    const sortColumn = route.queryParamMap.get('sortColumn') || '';
    const searchTerm = route.queryParamMap.get('searchTerm') || '';

    return this.service.fetchDataSet(
      +page,
      +pageSize,
      sortColumn,
      sortOrder,
      searchTerm
    );
  }
}
