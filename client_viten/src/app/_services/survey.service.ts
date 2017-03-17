import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Survey } from '../_models/survey';
import { SurveyList } from '../_models/index';
import { environment } from '../../environments/environment';



@Injectable()
export class SurveyService {

  surveyList: SurveyList[] = [];

  constructor(private http: Http) {

  }

  /**
   * answer one survey
   * @param  {Array<number>}       answers  List of answers, each number
   *                                        represents one answer.
   * @param  {String}              idString identifier for a survey
   * @return {Observable<boolean>}          Observable boolean, true if successful
   */
  answerSurvey(answers: Array<number>, idString: String): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(environment.URL.survey + '/' + idString, {answers}, options)
    .map( response => {
      console.log(response);
      return true;
    },
    error => {
      console.error(error.json());
      return false;
    });
  }


  /**
   * getToken()
   *
   * @returns {string} user token if it exists in the local storage. undefined otherwise
   */
  private getToken(): string {
    return localStorage.getItem('token');
  }



  /**
   * getSurvey(idString: String)
   *
   * @param {string} idString the id of the survey one wants to get
   * @returns {Observable<any>} returns an observable holding the requested survey and responses
   */
   getSurvey(idString: String): Observable<any> {
     return this.http.get(environment.URL.survey + '/' + idString)
     .map( response => {
       return response.json();
     },
     error => {
       return error.json();
     });
 }



  /**
   * postSurvey(survey: Survey)
   *
   * @param {Survey} survey a Survey model object holding the survey data one wants to post
   * @returns {Observable<boolean>} returns an observable with the success status of the http post
   */
  postSurvey(survey: Survey): Observable<Survey> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(environment.URL.survey, survey, options)
    .map( response => {
      const s: Survey = response.json();
      return s;
    },
    error => {
      return error.json();
    });
  }

  /**
   * patchSurvey(surveyId: string, survey: Survey)
   *
   * @param {Survey} survey a Survey model object holding the survey data one wants to patch
   * @returns {Observable<Survey>} returns an observable with the success status of the http patch
   */
  patchSurvey(surveyId: string, survey: Survey): Observable<any> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.patch(environment.URL.survey + '/' + surveyId, survey, options)
      .map( response => {
        const jsonResponse = response.json();
        return jsonResponse.survey;
      },
      error => {
        return error.json();
      });
  }

  /**
   * deleteSurvey(surveyId: string)
   *
   * @param {string} idString the id of the survey one wants to get
   * @returns {Observable<boolean>} returns an observable with the success status of the http delete
   */
  deleteSurvey(surveyId: string): Observable<boolean> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.delete(environment.URL.survey + '/' + surveyId, options)
      .map( response => {
        return true;
      },
      error => {
        return false;
      });
  }




  /**
   * getAllSurveys()
   *
   * @returns {Observable<SurveyList[]>} returns an observable with a list of
   * objects with survey names, ids, active status and date.
   */
  getAllSurveys(): Observable<SurveyList[]> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);

    return this.http.get(environment.URL.survey, { headers })
      .map(
        response => {
          // only update our list for status in the 200 range. If we get status 304
          // everything is good and there is no need to update our list either.
          if (response.status >= 200 && response.status < 300) {
            const json = response.json();
             // status 200, a statuscode and a message means that the request
             // was successful, but there were no surveys to fetch.
            if (json.status && json.message) {
              return this.surveyList;
            }
            this.surveyList = <SurveyList[]>json;
          }
          return this.surveyList;
        },
        error => {
          return this.surveyList;
        });
  }

  /**
   * getSurveyAs(surveyId: string, type: string)
   * @param  {string}          surveyId the ID of the survey to get
   * @param  {string}          type     the type ('json' or 'csv') of data to get
   * @return {Observable<any>}          the raw data, as observable.
   */
  getSurveyAs(surveyId: string, type: string): Observable<any> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    const url = type === 'csv' ? environment.URL.surveyAsCSV : environment.URL.surveyAsJson;
    return this.http.get(url + '/' + surveyId, { headers })
      .map(
        response => {
          return response;
        },
        error => {
          return error;
        }
      );
  }

}
