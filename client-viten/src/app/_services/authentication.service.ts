import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {

  private url = {
    login: 'localhost:2000/api/auth/login'
  }

  constructor(private http: Http) { }

  /**
   * Try to get a new JWT
   * @return {boolean} true if JWT was successfully renewed else false
   */
  getNewJWT():Observable<boolean> {
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
                // Set user data in localStorage
                // TODO!
                
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
