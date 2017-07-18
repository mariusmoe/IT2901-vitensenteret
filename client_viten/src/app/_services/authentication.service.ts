import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JwtHelper } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { User } from '../_models/user';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class AuthenticationService {

  public token: string;
  private user: User;
  private jwtHelper: JwtHelper = new JwtHelper();
  private userList: User[] = [];
  /**
   * Constructor Set current user
   */
  constructor(
    private http: Http,
    private router: Router ) {
    // TODO make sure this work even when you log out!
  }

  /**
   * Log out current user
   */
  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  changeEmail(newEmail: string): Observable<boolean> {
    const token = this.getToken();
    const headers = new Headers({'content-type': 'application/json'});
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers });
    const data = { 'email': newEmail };
      return this.http.post(environment.URL.newEmail, JSON.stringify(data), options)
      .map(
        response => {
          return true;
        },
        error => {
          console.log(error.text());
          return false;
        }
      );
  }

  /**
   * requests to change the user's password
   * @param  {string}              newPassword the new password chosen by the user
   * @return {Observable<boolean>}             servers response, as an Observable
   */
  changePassword(newPassword: string): Observable<boolean> {
    const token = this.getToken();
    const headers = new Headers({'content-type': 'application/json'});
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers });
    const data = { 'password': newPassword };
      return this.http.post(environment.URL.newPassword, JSON.stringify(data), options)
      .map(
        response => {
          return true;
        },
        error => {
          console.log(error.text());
          return false;
        }
      );
  }

  /**
   * requests a referral link from the server
   * @param  {string}             role The role of the user that is to be referred
   * @return {Observable<string>}      The referral link, as an Observable
   */
  getReferral(role: string): Observable<string> {
    const token = this.getToken();
    if (!token) {
      return Observable.throw('jwt not found'); // TODO: fix me.
    }
    const headers = new Headers();
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers });
      return this.http.get(environment.URL.refer + role, options)
      .map(
        response => {
          const jsonResponse = response.json();
          if (jsonResponse) {
            return jsonResponse.link;
          } else {
            return 'null';
          }
        },
        error => {
          console.log(error.text());
          return null;
        }
      );
  }

  /**
   * getCurrentUserObservable
   * @return {BehaviorSubject}      userSub with userdata
   */
  getUser(): User {
    const token = this.getToken();
    if (token) {
      const currentUser = this.decodeToken(token);
      return <User>{
        _id: currentUser._id,
        email: currentUser.email,
        role: currentUser.role
      };
    };
  }

  /**
   * Gets the JWT token from localStorage
   * @return {string} user token if it exists in the local storage. undefined otherwise
   */
  private getToken(): string {
    return localStorage.getItem('token');
  }

  /**
   * deleteAccount
   *
   * Delete the account with the supplied id
   * @param {string} id Id of user to be deleted
   * @return boolean  true if deletion was successful.
   */
  deleteAccount(id: string): Observable<boolean> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    const data = { 'id': id };
    const body = JSON.stringify(data);
    const options = new RequestOptions({
      headers: headers,
      body: body
    });
    return this.http.delete(environment.URL.delete, options)
    .map(
      response => {
        return true;
      },
      error => {
        console.log(error.text());
        return false;
      }
    );
  }

  /**
   * Requests all users from the server
   * @return {Observable<User[]>} a list of User, as an Observable
   */
  getAllUsers(): Observable<User[]> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.get(environment.URL.allUsers, options)
      .map(
        response => {
          const jsonResponse = response.json();
          if (jsonResponse) {
            this.userList = new Array<User>();
            for (const user of jsonResponse){
              const us = {
                _id: user._id,
                email: user.email,
                role: user.role,
              };


              this.userList.push(us);
            }
            return this.userList;
          } else {
            return null;
          }
        },
        error => {
          console.log(error.text());
          return null;
        }
      );
  }

    /**
     * Decode JWT token
     * @param  {string} token token as it is stored in localstorage
     * @return {User}         User object
     */
    decodeToken(token): User {
      return this.jwtHelper.decodeToken(token);
    }

  /**
   * Try to get a new JWT
   * @return {boolean} true if JWT was successfully renewed else false
   */
  getNewJWT(): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.token}`);
    const options = new RequestOptions({ headers: headers });
    return this.http.get(environment.URL.renewJWT, options)
      .map(
        response => {
          if (response.status !== 200) {
            // Error during login
            console.error('can\'t renew JWT');
            return false;
          } else {
            const jsonResponse = response.json();
            if (jsonResponse) {
              localStorage.setItem('token', jsonResponse.token);
              localStorage.setItem('center', jsonResponse.center);
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
      ).catch(e => {
        return Observable.of(false);
      });
  }

  /**
   * Requests to log the user in
   * @param  {string}              email    The user's email
   * @param  {string}              password The user's password
   * @return {Observable<boolean>}          Server's response, as an Observable
   */
  login(email: string, password: string): Observable<boolean> {
      const headers = new Headers({'content-type': 'application/json'});
      const options = new RequestOptions({headers: headers});
      const data = { 'email': email, 'password': password };
      return this.http.post(environment.URL.login, JSON.stringify(data), options)
        .map(
          response => {
            const jsonResponse = response.json();
            if (jsonResponse) {
              localStorage.setItem('token', jsonResponse.token);
              localStorage.setItem('center', jsonResponse.center);
              //
              return true;
            } else {
              return false;
            }
          },
          error => {
            console.log(error.text());
            return false;
          }
        );
  }

  /**
   * Requests to register a user
   * @param  {string}              email    The email of the user
   * @param  {string}              password The password of the user
   * @param  {string}              link     The referral link that was used
   * @return {Observable<boolean>}          Server's response, as an Observable
   */
  registerUser(email: string, password: string, link: string): Observable<boolean> {
      const headers = new Headers({'content-type': 'application/json'});
      const options = new RequestOptions({headers: headers});
      const data = { 'email': email, 'password': password, 'referral_string': link };
      return this.http.post(environment.URL.newUser, JSON.stringify(data), options)
        .map(
          response => {
            const jsonResponse = response.json();
            console.log(jsonResponse);
            return true;
          },
          error => {
            console.log(error.text());
            return false;
          }
        );
  }

}
