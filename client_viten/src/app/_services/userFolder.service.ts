import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JwtHelper } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { User } from '../_models/user';
import { Folder } from '../_models/folder';
import { Survey } from '../_models/survey';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class UserFolderService {


  /*
  folderRoutes.get('/', requireAuth, FolderController.getUserFolders);

  folderRoutes.post('/', requireAuth, FolderController.createUserFolder);

  folderRoutes.delete('/:folderId', requireAuth, FolderController.deleteUserFolder);
   */


  /**
   * Constructor
   */
  constructor(
    private http: Http,
    private router: Router ) {
  }


  /**
   * getToken()
   *
   * @return {string} user token if it exists in the local storage. undefined otherwise
   */
  private getToken(): string {
    return localStorage.getItem('token');
  }

  getAllFolders(): Observable<Folder[]> {

    const token = this.getToken();
    const headers = new Headers();
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.get(environment.URL.folders, options).map(
      response => {
        return response.json();
      },
      error => {
        console.error(error.text());
        return null;
      }
    );
  }


  createFolder(newFolder: Folder, parentFolder: Folder): Observable<Folder[]> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers }); // Create a request option

    const body = { folder: newFolder, parentFolderId: parentFolder._id };
    return this.http.post(environment.URL.folders, body, options).map(
      response => {
        return response.json();
      },
      error => {
        console.error(error.text());
        return null;
      }
    );
  }


  patchFolder(updatedFolder: Folder): Observable<Folder[]> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers }); // Create a request option

    const body = { folder: updatedFolder };
    return this.http.patch(environment.URL.folders + updatedFolder._id, body, options).map(
      response => {
        return response.json();
      },
      error => {
        console.error(error.text());
        return null;
      }
    );
  }

  updateFolders(data: any): Observable<Folder[]> {

    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.patch(environment.URL.folders, data, options).map(
      response => {
        return response.json();
      },
      error => {
        console.error(error.text());
        return null;
      }
    );
  }

  deleteFolder(folderId: string) {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.delete(environment.URL.folders + folderId, options).map(
      response => {
        return response.json();
      },
      error => {
        console.error(error.text());
        return null;
      }
    );
  }

}
