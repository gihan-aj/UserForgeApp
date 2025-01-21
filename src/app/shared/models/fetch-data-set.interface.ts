import { Observable } from 'rxjs';
import { PagedList } from './paged-list.interface';

export interface FetchDataSet<T> {
  fetchDataSet(
    page: number,
    pageSize: number,
    sortColumn?: string,
    sortOrder?: string,
    searchTerm?: string
  ): Observable<PagedList<T>>;
}
