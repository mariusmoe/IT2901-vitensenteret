import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JwtHelper } from 'angular2-jwt';

import { User } from '../_models/user';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticationService {

  private url = {
    login: 'http://localhost:2000/api/auth/login',
    allUsers: 'http://localhost:2000/api/auth/all_users',
    delete: 'http://localhost:2000/api/auth/delete_account',
    refer: 'http://localhost:2000/api/auth/get_referral_link/',
    renewJWT: 'http://localhost:2000/api/auth/get_token/',
    newUser: 'http://localhost:2000/api/auth/register'
  };

  public token: string;
  private user: User;
  private userSub: BehaviorSubject<User> = new BehaviorSubject<User>(null); // start with null in the userSub
  private jwtHelper: JwtHelper = new JwtHelper();
  private userList: User[] = [];
  /**
   * Constructor Set current user
   */
  constructor(private http: Http) {
    // TODO make sure this work even when you log out!
    const token = (localStorage.getItem('token'));
    if (token) {
      const currentUser = this.decodeToken(token);
      this.user = {
        _id: currentUser._id,
        email: currentUser.email,
        role: currentUser.role,
      };
      // console.log(this.user);
      // push user to subscribers
      this.userSub.next(this.user);
    }
  }

  getReferral(role): Observable<string> {
    const token = this.getToken();
    if (!token) {
      return Observable.throw('jwt not found'); // TODO: fix me.
    }
    const headers = new Headers();
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers });
      return this.http.get(this.url.refer + role, options)
      .map(
        response => {
          if (response.status !== 200) {
            // Error during login
            console.error(response);
          } else {
            const jsonResponse = response.json();
            if (jsonResponse) {
              return jsonResponse.link;
            } else {
              return 'null';
            }
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
  getCurrentUserObservable() {
    return this.userSub.asObservable();
  }

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
  deleteAccoutn(id: string): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return Observable.throw('jwt not found'); // TODO: fix me.
    }
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    const data = { 'id': id };
    const body = JSON.stringify(data);
    const options = new RequestOptions({
      headers: headers,
      body: body
    });
      return this.http.delete(this.url.delete, options)
      .map(
        response => {
          if (response.status !== 200) {
            // Error during delete
            console.error(response);
          } else {
            return true;
          }
        },
        error => {
          console.log(error.text());
          return false;
        }
      );
    }

  getAllUsers(): Observable<User[]> {
    const token = this.getToken();
    if (!token) {
      return Observable.throw('jwt not found'); // TODO: fix me.
    }
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.get(this.url.allUsers, options)
      .map(
        response => {
          if (response.status !== 200) {
            // Error during login
            console.error(response);
          } else {
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
    return this.http.get(this.url.renewJWT, options)
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
      ).catch(e => {
        return Observable.of(false);
      });
  }

  login(email, password): Observable<boolean> {
      const headers = new Headers({'content-type': 'application/json'});
      const options = new RequestOptions({headers: headers});
      const data = { 'email': email, 'password': password };
      return this.http.post(this.url.login, JSON.stringify(data), options)
        .map(
          response => {
            if (response.status !== 200) {
              // Error during login
              console.error('can\'t login');
              return false;
            } else {
              const jsonResponse = response.json();
              if (jsonResponse) {
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
        );
  }


  registerUser(email: string, password: string, link: string): Observable<boolean> {
      const headers = new Headers({'content-type': 'application/json'});
      const options = new RequestOptions({headers: headers});
      const data = { 'email': email, 'password': password, 'referral_string': link };
      return this.http.post(this.url.newUser, JSON.stringify(data), options)
        .map(
          response => {
            if (response.status !== 200) {
              // Error during user create
              console.error('can\'t create user');
              return false;
            }
            else {
              const jsonResponse = response.json();
              console.log(jsonResponse);
              return true;
            }
          },
          error => {
            console.log(error.text());
            return false;
          }
        );
  }

}
