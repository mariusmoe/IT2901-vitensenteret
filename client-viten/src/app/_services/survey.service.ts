import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, Response, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs';

import { SurveyList } from '../_models/index';

@Injectable()
export class SurveyService {

  private surveyList: SurveyList[] = []
  private token: string;


  private url = { getSurveys: 'http://localhost:2000/api/survey/'}

  constructor(private http: Http) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }


  getSurveys(): Observable<SurveyList[]>{
    let headers = new Headers()
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.token}`);

    return this.http.get(this.url.getSurveys, { headers })
      .map(
        response => {
          if (response.status != 200){
            // Error during login
            console.error("can't retrive surveys")
            return this.surveyList;
          } else {
            let jsonResponse = response.json();
            if (jsonResponse){
              this.surveyList = new Array<SurveyList>();

              for (let survey of jsonResponse){
                let su = new SurveyList();
                su._id    = survey._id;
                su.name   = survey.name;
                su.active = survey.active;
                su.date   = survey.date;

                this.surveyList.push(su);
              }
              return this.surveyList;
            } else {
              return this.surveyList;
            }
          }
        },
        error => {
          let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
          // console.error(errMsg); // log to console instead
          return Observable.throw(errMsg);
        }
      )
  }




}
