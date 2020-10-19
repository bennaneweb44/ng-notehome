import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalConstants } from 'src/app/_common/global-constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })  
};

@Injectable({
  providedIn: 'root'
})

export class ArticlesnotesService {

  message = null;
 
  constructor(private http: HttpClient) { }

  delete(id_article, id = null)
  {
    if (id) 
    {
      return this.http.delete(GlobalConstants.apiURL + '/articles/' + id, httpOptions)
                      .subscribe(() => this.message = 'Article supprimé');
    } 
    else 
    {
      return this.http.delete(GlobalConstants.apiURL + '/articles_notes/delete/article/' + id_article, httpOptions)
                      .subscribe(() => this.message = 'Article supprimé et retiré de toutes les notes');
    }
  }
}
