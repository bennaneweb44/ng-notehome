import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'src/app/_common/global-constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getArticles(rayon_id = null): Observable<any> {
    if (rayon_id) {
      return this.http.get(GlobalConstants.apiURL + '/articles/rayon/' + rayon_id, { responseType: 'text' });
    } else {
      return this.http.get(GlobalConstants.apiURL + '/articles', { responseType: 'text' });
    }    
  }

  getRayonsWithArticles() : Observable<any> {
    return this.http.get(GlobalConstants.apiURL + '/articles/rayons', { responseType: 'text' });
  }

  setArticle(articleJSON): Observable<any> {    
    return this.http.post(GlobalConstants.apiURL + '/articles', articleJSON, httpOptions);
  }
}
