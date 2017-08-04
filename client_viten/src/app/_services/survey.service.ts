import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Survey } from '../_models/survey';
import { Response } from '../_models/response';
import { SurveyList } from '../_models/index';
import { TranslateService } from './translate.service';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';


@Injectable()
export class SurveyService {

  constructor(private http: Http, private translateService: TranslateService) {

  }

  /**
   * postSurveyResponse(response: Response)
   * @param  {Response}          response The response to post, containing all required fields
   * @return Observable<boolean>          success state of the response
   */
  postSurveyResponse(response: Response): Observable<boolean> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.post(environment.URL.survey + '/' + response.surveyId, response, options)
    .map( success => {
      return true;
    },
    error => {
      return error;
    });
  }


  /**
   * getToken()
   *
   * @return {string} user token if it exists in the local storage. undefined otherwise
   */
  private getToken(): string {
    return localStorage.getItem('token');
  }

  /**
   * Gets all nicknames a survey has registered
   * @return {[type]} [description]
   */
  public getNicknames(surveyId: string): Observable<any> {
    return this.http.get(environment.URL.allNicknames + '/' + surveyId)
    .map( response => {
      const json = response.json();
      // console.log(json);
      return json.nicknames;
    },
    error => {
      return error;
    });
}



  /**
   * getSurvey(idString: String)
   *
   * @param {string} idString the id of the survey one wants to get
   * @return {Observable<any>} returns an observable holding the requested survey and responses
   */
   getSurvey(idString: String): Observable<any> {
    //  console.log(idString);
     return this.http.get(environment.URL.survey + '/' + idString)
     .map( response => {
       const json = response.json();
      //  console.log(json);
       const survey = this.correctSurveyValidity(json.survey);
       return { survey: survey, responses: json.responses };
     },
     error => {
       return error.json();
     });
 }



  /**
   * postSurvey(survey: Survey)
   *
   * @param {Survey} survey a Survey model object holding the survey data one wants to post
   * @return {Observable<boolean>} returns an observable with the success status of the http post
   */
  postSurvey(survey: Survey): Observable<Survey> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(environment.URL.survey, survey, options)
    .map( response => {
      return this.correctSurveyValidity(response.json());
    },
    error => {
      return error.json();
    });
  }

  /**
   * patchSurvey(surveyId: string, survey: Survey)
   *
   * @param {Survey} survey a Survey model object holding the survey data one wants to patch
   * @return {Observable<Survey>} returns an observable with the success status of the http patch
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
        return this.correctSurveyValidity(jsonResponse.survey);
      },
      error => {
        return error.json();
      });
  }

  /**
   * deleteSurvey(surveyId: string)
   *
   * @param {string} idString the id of the survey one wants to get
   * @return {Observable<boolean>} returns an observable with the success status of the http delete
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
   * copySurvey(surveyId: string, includeResponses: boolean)
   *
   * @param  {string}        surveyId         the id of the survey one wants to copy
   * @param  {boolean}       includeResponses whether to also copy responses
   * @return Observable<any>                  the copied survey object
   */
  copySurvey(surveyId: string): Observable<any> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);

    const options = new RequestOptions({ headers: headers }); // Create a request option

    const copyLabel = this.translateService.instant('CopyLabel');

    return this.http.post(environment.URL.surveyCopy + '/' + surveyId,
      { copyLabel: copyLabel }, options)
    .map( response => {
      return this.correctSurveyValidity(response.json());
    },
    error => {
      return error.json();
    });
  }


  /**
   * getAllPublishedSurveys()
   *
   * @return {Observable<SurveyList[]>} returns an observable with a list of
   * objects with survey names, ids, active status and date.
   */
  getAllPublishedSurveys(center: string): Observable<SurveyList[]> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);

    return this.http.get(environment.URL.surveyAll + '/' + center, { headers })
      .map(
        response => {
          const json = response.json();
          // only update our list for status in the 200 range. If we get status 304
          // everything is good and there is no need to update our list either.
          if (response.status >= 200 && response.status < 300) {
             // status 200, a statuscode and a message means that the request
             // was successful, but there were no surveys to fetch.
            if (json.status && json.message) {
              return <SurveyList[]>[];
            }
          }
          return <SurveyList[]>json;
        },
        error => {
          return <SurveyList[]>[];
        });
  }

  /**
   * getSurveyAs(surveyId: string, type: string)
   * @param  {string}          surveyId the ID of the survey to get
   * @return {Observable<any>}          the raw data, as observable.
   */
  getSurveyAsCSV(surveyId: string): Observable<any> {
    const token = this.getToken();
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);
    return this.http.get(environment.URL.surveyAsCSV + '/' + surveyId, { headers })
      .map(
        response => {
          return response;
        },
        error => {
          return error;
        }
      );
  }


  /**
   * correctSurveyValidity(survey: Survey)
   * Removes the fields that should not be present
   * @param  {Survey} survey the survey reference to modify
   * @return {Survey} the survey
   */
  private correctSurveyValidity(survey: Survey): Survey {
    // remove options-properties of non-multi questions
    for (const qo of survey.questionlist) {
      if (qo.mode !== 'multi' && qo.mode !== 'single') {
        delete qo.lang.no.options;
        delete qo.lang.en.options;
      }
    }
    // somewhat hacky way to determine english state.
    // If English state is not found, then delete any properties not needed.
    if (!survey.questionlist[0].lang.en
      || !survey.questionlist[0].lang.en.txt
      || !(survey.questionlist[0].lang.en.txt.length > 0)) {
        delete survey.endMessage.en;
        for (const qo of survey.questionlist) {
          delete qo.lang.en;
        }
    }
    return survey;
  }

}
