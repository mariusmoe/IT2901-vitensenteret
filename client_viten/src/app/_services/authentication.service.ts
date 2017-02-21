import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';
import { JwtHelper } from 'angular2-jwt';

import { User } from '../_models/user';

import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {

  private url = {
    login: 'http://localhost:2000/api/auth/login'
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
      this.user.email     = currentUser.email;
      this.user.role      = currentUser.role;
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
