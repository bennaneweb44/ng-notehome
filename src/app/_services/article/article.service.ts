import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/_common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getArticles(rayon_id): Observable<any> {
    return this.http.get(GlobalConstants.apiURL + '/articles/rayon/' + rayon_id, { responseType: 'text' });
  }
}
