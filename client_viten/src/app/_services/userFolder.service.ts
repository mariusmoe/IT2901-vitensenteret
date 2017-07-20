import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JwtHelper } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { TreeModel } from 'ng2-tree';
import { User } from '../_models/user';
import { Folder } from '../_models/folder';
import { Survey } from '../_models/Survey';

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

  private treeGeneratorRecursive(currNode: Folder) {
    const newNode: TreeModel = {
      value: currNode.title,
      children: [],
    };
    currNode.surveys.forEach( (s: string) => {
      // push surveys
      newNode.children.push({
        'value': s,
      });
    });
    currNode.folders.forEach( (f: Folder) => {
      // push surveys
      newNode.children.push(this.treeGeneratorRecursive(f));
    });

    return newNode;
  }

  getAllFolders(): Observable<TreeModel> {

    const token = this.getToken();
    const headers = new Headers();
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.get(environment.URL.folders, options).map(
      response => {
        const folders = response.json();
        const root = folders.filter(x => x.isRoot = true)[0];
        return this.treeGeneratorRecursive(root);
      },
      error => {
        console.log(error.text());
        return null;
      }
    );
  }



  /**
   * getToken()
   *
   * @return {string} user token if it exists in the local storage. undefined otherwise
   */
  private getToken(): string {
    return localStorage.getItem('token');
  }

}
