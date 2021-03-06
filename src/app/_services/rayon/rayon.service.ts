import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalConstants } from '../../_common/global-constants';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class RayonService {

  constructor(private http: HttpClient) { }

  getRayons(): Observable<any> {
    return this.http.get(GlobalConstants.apiURL + '/rayons', { responseType: 'text' });
  }

  getRayon(id): Observable<any> {
    return this.http.get(GlobalConstants.apiURL + '/rayons/' + id, { responseType: 'text' });
  }  

  setRayon(id, rayonJSON): Observable<any> {    
    return this.http.put(GlobalConstants.apiURL + '/rayons/' + id, rayonJSON, httpOptions);
  }
  
}
