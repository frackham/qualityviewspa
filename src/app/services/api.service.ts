import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { tempproject } from '../model/tempproject';
import { temppart } from '../model/temppart';

@Injectable({
  providedIn: 'root'
})

//TODO: Create base api service.
export class ApiService {

  // REST API
  endpoint = 'https://localhost:44374'; //TODO: Move to environment/config/constructor.


  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // Project
  getSingleProject(id: string): Observable<tempproject> {
    return this.httpClient.get<tempproject>(this.endpoint + '/project/' + id)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  getProjects(id: any): Observable<tempproject> {
    return this.httpClient.get<tempproject>(this.endpoint + '/project/list')
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  // Part
  getSinglePart(id: string): Observable<temppart> {
    return this.httpClient.get<temppart>(this.endpoint + '/part/' + id)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

getParts(id: any): Observable<temppart> {
  return this.httpClient.get<temppart>(this.endpoint + '/part/list')
  .pipe(
    retry(1),
    catchError(this.processError)
  )
}

  processError(err: { error: { message: string; }; status: any; message: any; }) {
    let message = '';
    if(err.error instanceof ErrorEvent) {
     message = err.error.message;
    } else {
     message = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    console.log(message);
    return throwError(message);
  }
}
