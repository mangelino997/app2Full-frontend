import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class AppService {
  //Define la url base
  private URL_BASE = 'http://localhost:8080/jit/auth';
  constructor(private http: Http) {}
  public obtenerMenu() {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', localStorage.getItem('token'));
    const options = new RequestOptions({headers: headers});
    return this.http.get(this.URL_BASE + '/menu/1', options);
  }
  //Retorn la url base
  public getUrlBase() {
    return this.URL_BASE;
  }
}
