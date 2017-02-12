import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {

  constructor() { }

  /**
   * Try to get a new JWT
   * @return {boolean} true if JWT was successfully renewed else false
   */
  getNewJWT():Observable<boolean> {
    return Observable.of(true); // placeholder
  }

}
