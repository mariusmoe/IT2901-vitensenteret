import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { JwtHelper } from 'angular2-jwt';

import { User } from '../_models/user';

import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {

  private url = {
    login: 'http://localhost:2000/api/auth/login',
    allUsers: 'http://localhost:2000/api/auth/all_users',
    delete: 'http://localhost:2000/api/auth/delete_account'
  }

  public token: string;
  private user = new User();
  private userSub: BehaviorSubject<User> = new BehaviorSubject<User>(null); // start with null in the userSub
  private jwtHelper: JwtHelper = new JwtHelper();

  /**
   * Constructor Set current user
   */
  constructor(private http: Http) {
    const token = (localStorage.getItem('token'));
    if (token) {
      const currentUser = this.decodeToken(token);
      this.user._id     = currentUser._id;
      this.user.email     = currentUser.email;
      this.user.role      = currentUser.role;
      console.log(this.user);
      // push user to subscribers
      this.userSub.next(this.user);
    }
  }

  /**
   * getCurrentUserObservable
   * @return {BehaviorSubject}      userSub with userdata
   */
  getCurrentUserObservable() {
    return this.userSub.asObservable();
  }
  private userList: User[] = []

  /**
   * getToken
   *
   * @returns String - user token if it exists in the local storage. undefined otherwise
   */
  private getToken(): string {
    return localStorage.getItem('token');
  }

  /**
   * deleteAccoutn
   *
   * Delete the account with the supplied id
   * @param {string} id Id of user to be deleted
   * @return boolean  true if deletion was successful.
   */
  deleteAccoutn(id:string): Observable<boolean> {
    let token = this.getToken();
    if (!token) {
      return Observable.throw('jwt not found'); // TODO: fix me.
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    let data = { "id": id }
    let body = JSON.stringify(data);
    let options = new RequestOptions({
      headers: headers,
      body: body
    });
      return this.http.delete(this.url.delete, options)
      .map(
        response => {
          if (response.status != 200){
            // Error during delete
            console.error(response)
          } else {
            return true;
          }
        },
        error => {
          console.log(error.text());
          return false;
        }
      )
    }

  getAllUsers():Observable<User[]>{
    let token = this.getToken();
    if (!token) {
      return Observable.throw('jwt not found'); // TODO: fix me.
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.get(this.url.allUsers, options)
      .map(
        response => {
          if (response.status != 200){
            // Error during login
            console.error(response)
          } else {
            let jsonResponse = response.json();
            if (jsonResponse){
              this.userList = new Array<User>();
              for (let user of jsonResponse){
                let us = new User();
                us._id = user._id;
                us.email = user.email;
                us.role = user.role;

                this.userList.push(us);
              }
              return this.userList;
            } else {
              return null;
            }
          }
        },
        error => {
          console.log(error.text());
          return null;
        }
      )
  }

    /**
     * Decode JWT token
     * @param  {string} token token as it is stored in localstorage
     * @return {User}         User object
     */
    decodeToken(token):User{
      return this.jwtHelper.decodeToken(token)
    }

  /**
   * Try to get a new JWT
   * @return {boolean} true if JWT was successfully renewed else false
   */
  getNewJWT():Observable<boolean> {
    // TODO
    return Observable.of(true); // placeholder
  }

  login(email, password): Observable<boolean> {
      let headers = new Headers({"content-type": "application/json"});
      let options = new RequestOptions({headers: headers});
      let data = { "email": email, "password": password }
      return this.http.post(this.url.login, JSON.stringify(data), options)
        .map(
          response => {
            if (response.status != 200){
              // Error during login
              console.error("can't login")
              return false
            } else {
              let jsonResponse = response.json();
              if (jsonResponse){
                localStorage.setItem('token', jsonResponse.token);
                // TODO: set user info? no dont to this!!!
                //
                return true;
              } else {
                return false;
              }
            }
          },
          error => {
            console.log(error.text());
            return false;
          }
        )
  }

}
