import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/_common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get(GlobalConstants.apiURL + '/categories', { responseType: 'text' });
  }
}
