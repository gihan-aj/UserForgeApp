import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedList } from '../../shared/models/paged-list.interface';
import { UserDetails } from '../models/user-details.interface';
import { FetchDataSet } from '../../shared/models/fetch-data-set.interface';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService implements FetchDataSet<UserDetails> {
  baseUrl: string = `${environment.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  fetchDataSet(
    page: number,
    pageSize: number,
    sortColumn?: string,
    sortOrder?: string,
    searchTerm?: string
  ): Observable<PagedList<UserDetails>> {
    const url = this.baseUrl;

    let queryParams = new HttpParams();
    if (searchTerm) {
      queryParams = queryParams.append('searchTerm', searchTerm);
    }
    if (sortColumn) {
      queryParams = queryParams.append('sortColumn', sortColumn);
    }
    if (sortOrder) {
      queryParams = queryParams.append('sortOrder', sortOrder);
    }
    queryParams = queryParams.append('page', page.toString());
    queryParams = queryParams.append('pageSize', pageSize.toString());

    return this.http.get<PagedList<UserDetails>>(url, { params: queryParams });
  }
}
