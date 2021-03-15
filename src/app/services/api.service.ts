import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { tempproject } from '../model/tempproject';
import { temppart } from '../model/temppart';
import { temppartsofprojects } from '../model/temppartsofprojects';
import { tempnote } from '../model/tempnote';

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
// Note
getSingleNote(id: string): Observable<tempnote> {
  return this.httpClient.get<tempnote>(this.endpoint + '/note/' + id)
  .pipe(
    retry(1),
    catchError(this.processError)
  )
}

createNote(note: tempnote): void{
  var noteUpdate: any = {};
  noteUpdate.Text = note.text;
  noteUpdate.Todo = note.todo;
  delete noteUpdate.id;
  this.httpClient.post<tempnote>(this.endpoint + '/note/', noteUpdate).subscribe(data => {
    console.log('post response');
    console.log(data);
  });
}

deleteNote(id: string): any {
  return this.httpClient.delete<tempnote>(this.endpoint + '/note/' + id)
  .pipe(
    retry(1),
    catchError(this.processError)
  )
}

postSingleNote(id: string, note: tempnote): void{
  // console.log(`attempting to post update for note ${id}`);
  var noteUpdate: any = {};
  noteUpdate.Text = note.text;
  var todo: boolean = note.todo as boolean; //Ensure passed as bool.
  noteUpdate.Todo = todo;
  // noteUpdate.IsDefault = note.i;
  // noteUpdate.Image = note.;
  // noteUpdate.Logo = note.;

  // console.log(`attempting to post: ${JSON.stringify(noteUpdate)}`);

  this.httpClient.post<tempnote>(this.endpoint + '/note/' + id, noteUpdate).subscribe(data => {
    console.log('post response');
    console.log(data);
  });
}

getNotes(id: any): Observable<tempnote> {
  return this.httpClient.get<tempnote>(this.endpoint + '/note/list')
  .pipe(
    retry(1),
    catchError(this.processError)
  )
}

  // Project
  getSingleProject(id: string): Observable<tempproject> {
    return this.httpClient.get<tempproject>(this.endpoint + '/project/' + id)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  deleteProject(id: string): any {
    return this.httpClient.delete<tempproject>(this.endpoint + '/project/' + id)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }
  createProject(project: tempproject): void{
    // console.log(`attempting to post update for project ${id}`);
    var projectUpdate: any = {};
    projectUpdate.Name = project.name;
    projectUpdate.Description = project.description;
    delete projectUpdate.id;
    // projectUpdate.IsDefault = project.i;
    // projectUpdate.Image = project.;
    // projectUpdate.Logo = project.;

    // console.log(`attempting to post: ${JSON.stringify(projectUpdate)}`);

    this.httpClient.post<tempproject>(this.endpoint + '/project/', projectUpdate).subscribe(data => {
      console.log('post response');
      console.log(data);
    });
  }

  postSingleProject(id: string, project: tempproject): void{
    // console.log(`attempting to post update for project ${id}`);
    var projectUpdate: any = {};
    projectUpdate.Name = project.name;
    projectUpdate.Description = project.description;
    // projectUpdate.IsDefault = project.i;
    // projectUpdate.Image = project.;
    // projectUpdate.Logo = project.;

    // console.log(`attempting to post: ${JSON.stringify(projectUpdate)}`);

    this.httpClient.post<tempproject>(this.endpoint + '/project/' + id, project).subscribe(data => {
      console.log('post response');
      console.log(data);
    });
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

  deletePart(id: string): any {
    return this.httpClient.delete<temppart>(this.endpoint + '/part/' + id)
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

  getPartDetails(id: any): Observable<temppartsofprojects> {
    return this.httpClient.get<temppartsofprojects>(this.endpoint + '/part/listdetails')
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  postSinglePart(id: string, part: temppart): void{
    // console.log(`attempting to post update for project ${id}`);
    var partUpdate: any = {};
    partUpdate.Name = part.name;
    partUpdate.Description = part.description;
    // projectUpdate.IsDefault = project.i;
    // projectUpdate.Image = project.;
    // projectUpdate.Logo = project.;

    // console.log(`attempting to post: ${JSON.stringify(projectUpdate)}`);

    this.httpClient.post<temppart>(this.endpoint + '/part/' + id, part).subscribe(data => {
      console.log('post response');
      console.log(data);
    });
  }

  ///////////////////////
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
