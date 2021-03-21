import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { tempproject } from '../model/tempproject';
import { temppart } from '../model/temppart';
import { temppartsofprojects } from '../model/temppartsofprojects';
import { tempnote } from '../model/tempnote';

@Injectable({
	providedIn: 'root',
})

// TODO: Create base api service.
export class ApiService {
  // REST API
  endpoint = 'https://localhost:44374'; // TODO: Move to environment/config/constructor.


  constructor(private httpClient: HttpClient) { }

  httpHeader = {
  	headers: new HttpHeaders({
  		'Content-Type': 'application/json',
  	}),
  }

  // /////////////////////
  processError(err: { error: { message: string; }; status: any; message: any; }) {
  	let message = '';
  	if (err.error instanceof ErrorEvent) {
  		message = err.error.message;
  	} else {
  		message = `Error Code: ${err.status}\nMessage: ${err.message}`;
  	}
  	console.log(message);
  	return throwError(message);
  }

  // //////////////////////////////
  // Generic
  getSingleObject<T>(id: string, controller: string): Observable<T> {
  	return this.httpClient.get<T>(this.endpoint + '/' + controller + '/' + id)
  		.pipe(
  			retry(1),
  			catchError(this.processError),
  		);
  }

  createObject<T>(object: T, controller: string): void {
  	const objectUpdate: any = object;
  	// objectUpdate.Text = object.text;
  	// objectUpdate.Todo = object.todo;
  	delete objectUpdate.id;
  	this.httpClient.post<T>(this.endpoint + '/' + controller + '/', objectUpdate).subscribe((data) => {
  		console.log('post response');
  		console.log(data);
  	});
  }

  deleteObject(id: string, controller: string): any {
  	return this.httpClient.delete(this.endpoint + '/' + controller + '/' + id)
  		.pipe(
  			retry(1),
  			catchError(this.processError),
  		);
  }

  postSingleObject<T>(id: string, object: T, controller: string): void {
  	// console.log(`attempting to post update for object ${id}`);
  	const objectUpdate: any = object;
  	// We use the '{object}/{id}/fromObject' endpoint as we are passing the same object
  	// and not a carefully composed update object.
  	this.httpClient.post<T>(this.endpoint + '/' + controller + '/' + id + '/fromObject'
  		, objectUpdate).subscribe((data) => {
  		console.log('post response');
  		console.log(data);
  	});
  }

  getObjects<T>(id: any, controller: string, filter?:any): Observable<T> {
  	let queryString:string = '';
  	if (filter) {
  		// For each property, add as a querystring
  		for (const property in filter) {
  			if (Object.prototype.hasOwnProperty.call(filter, property)) {
  				// console.log(`Filter for object type ${controller}: [ ${property}: ${filter[property]} ]`);
  				if (queryString.length>0) {
  					queryString += '&';
  				}
  				queryString += `${property}=${filter[property]}`;
  			}
  		}
  	}
  	if (queryString.length>0) {
  		queryString = '?' + queryString;
  	}
  	// console.log(`queryString: ${queryString}`);

  	return this.httpClient.get<T>(this.endpoint + '/' + controller + '/list' + queryString)
  		.pipe(
  			retry(1),
  			catchError(this.processError),
  		);
  }


  // Generic, using override endpoints
  createObjectWithExplicitEndpoint<T>(createOverrideEndpoint: string, object: T, controller: string): void {
  	const objectUpdate: any = object;
  	delete objectUpdate.id;
  	if (createOverrideEndpoint.substring(1) !== '/') {
  		createOverrideEndpoint = '/' + createOverrideEndpoint;
  	}
  	this.httpClient.post<T>(this.endpoint + createOverrideEndpoint, objectUpdate).subscribe((data) => {
  		console.log('post response');
  		console.log(data);
  	});
  }


  getObjectsWithExplicitEndpoint<T>(listOverrideEndpoint: string, id: any, controller: string, filter?:any): Observable<T> {
  	let queryString:string = '';

  	if (listOverrideEndpoint.substring(0, 1) !== '/') {
  		listOverrideEndpoint = '/' + listOverrideEndpoint;
  	}
  	if (filter) {
  		// For each property, add as a querystring
  		for (const property in filter) {
  			if (Object.prototype.hasOwnProperty.call(filter, property)) {
  				// console.log(`Filter for object type ${controller}: [ ${property}: ${filter[property]} ]`);
  				if (queryString.length>0) {
  					queryString += '&';
  				}
  				queryString += `${property}=${filter[property]}`;
  			}
  		}
  	}
  	if (queryString.length>0) {
  		queryString = '?' + queryString;
  	}
  	// console.log(`queryString: ${queryString}`);

  	return this.httpClient.get<T>(this.endpoint + listOverrideEndpoint + queryString)
  		.pipe(
  			retry(1),
  			catchError(this.processError),
  		);
  }
}
