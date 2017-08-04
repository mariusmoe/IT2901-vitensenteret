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
export class CenterService {


  /**
   * Constructor
   */
  constructor(
    private http: Http,
    private router: Router ) {
  }


  /**
   * getAllCenters()
   * returns all senters
   * @return {Observable<any>} returns all senters, as a list
   */
  getAllCenters(): Observable<any> {
      return this.http.get(environment.URL.allCenters)
      .map(
        response => {
          return response.json();
        },
        error => {
          console.error(error.text());
          return null;
        }
      );
  }

  /**
   * getCenter()
   * gets a center
   * @param  {String}          centerId the id of the center to get
   * @return {Observable<any>}          the center object
   */
  getCenter(centerId: String): Observable<any> {
    return this.http.get(environment.URL.allCenters)
    .map(
      response => {
        const result = response.json();
        // if there is no array we instead get the 'route exists but no centers..' thing
        if (result && result[0]) {
          const center = result.filter(c => { return c['_id'] === centerId })[0];
          return center;
        }
        return result;
      },
      error => {
        console.error(error.text());
        return null;
      }
    );
  }



  /**
   * Requests to exit a survey
   * @param  {string}              password The password that is to match the exit survey password
   * @return {Observable<boolean>}          The server's response, as an Observable
   */
  exitSurvey(password: string, centerId: string): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(environment.URL.exitSurvey + '/' + centerId, {password: password}, options)
    .map( response => {
      return response.json().success || false;
    },
    error => {
      return false;
    });
  }

  /**
   * Requests to change the exit-survey password
   * @param  {string}              password The new exit-survey password
   * @return {Observable<boolean>}          The server's response, as an Observable
   */
  exitSurveyUpdatePassword(password: string, centerId: string): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${localStorage.getItem('token')}`);
    const options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.patch(environment.URL.exitSurvey + '/' + centerId, {password: password}, options)
    .map( response => {
      return true;
    },
    error => {
      return false;
    });
  }

  /**
   * centerUpdateCenterName()
   * updates the name of the center
   * @param  {string}              name     the new name of the center
   * @param  {string}              centerId the id of the center to rename
   * @return {Observable<boolean>}          whether or not the request was successful
   */
  centerUpdateCenterName(name: string, centerId: string): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${localStorage.getItem('token')}`);
    const options = new RequestOptions({ headers: headers });
    const data = { 'name': name, 'centerId': centerId };
      return this.http.patch(environment.URL.newCenterName, JSON.stringify(data), options)
      .map(
        response => {
          return true;
        },
        error => {
          console.error(error.text());
          return false;
        }
      );
  }


  /**
   * newCenter()
   * creates a new center
   * @param  {string}              name     the name of the new center
   * @param  {string}              password the exit-survey keycode
   * @return {Observable<boolean>}          whether or not the request was successful
   */
  newCenter(name: string, password: string): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${localStorage.getItem('token')}`);
    const options = new RequestOptions({ headers: headers });
    const data = { 'name': name, 'password': password };
      return this.http.patch(environment.URL.newCenter, JSON.stringify(data), options)
      .map(
        response => {
          return true;
        },
        error => {
          console.error(error.text());
          return false;
        }
      );
  }

}
