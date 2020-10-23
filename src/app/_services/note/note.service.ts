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
export class NoteService {

  message = null;

  constructor(private http: HttpClient) { }

  getNotes(): Observable<any> {
    return this.http.get(GlobalConstants.apiURL + '/notes', { responseType: 'text' });
  }

  getNote(id): Observable<any> {
    return this.http.get(GlobalConstants.apiURL + '/notes/' + id, { responseType: 'text' });
  }  

  setNote(id, noteJSON): Observable<any> {    
    return this.http.put(GlobalConstants.apiURL + '/notes/' + id, noteJSON, httpOptions);
  }

  delete(id)
  {
    return this.http.delete(GlobalConstants.apiURL + '/notes/' + id, httpOptions)
                      .subscribe(() => this.message = 'Note supprimée');
  }
}
