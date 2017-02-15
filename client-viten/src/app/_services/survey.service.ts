import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Survey, QuestionObject, Lang, Question } from '../_models/survey';
import { SurveyList } from '../_models/index';
import { BehaviorSubject }    from 'rxjs/BehaviorSubject';


@Injectable()
export class SurveyService {

  private url = 'http://localhost:2000/api/survey' // TODO: FIX ME
  private surveyList: SurveyList[] = []

  private selectedSurvey: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private http: Http) {

  }

  /**
   * select one surveyId
   * @param  {string} surveyId survey ID selected
   */
  selectSurvey(surveyId: string) {
    if (surveyId === this.selectedSurvey.getValue()){
      console.log("Same survey - nothing changed")
    } else {
      this.selectedSurvey.next(surveyId);
    }
  }

  getSelectedSurvey(){
    return this.selectedSurvey.asObservable();
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
   * getSurvey
   *
   * @param idString   the id of the survey one wants to get
   *
   * @returns Observable<Survey> returns an observable holding the
   * requested survey
   */
   getSurvey(idString: String): Observable<Survey> {
     return this.http.get(this.url + '/' + idString)
     .map( response => {
       let jsonResponse = response.json();
       if (response.status != 200){
         console.error(jsonResponse.status + " : " + jsonResponse.message);
         return null;
       }
       console.info(jsonResponse.status + " : " + jsonResponse.message);

       let json = response.json();
       let s = new Survey();
       s._id = json._id;
       s.name = json.name;
       s.date = json.date;
       s.active = json.active;
       s.questionlist = [];
       for (let i = 0; i<json.questionlist.length; i++) {
         let qo = new QuestionObject();
         qo.mode = json.questionlist.mode;
         qo.answer = json.questionlist.answer;
         qo.lang = new Lang();

         for (let language in json.questionlist[i].lang) {
           let q = new Question();
           q.txt = json.questionlist[i].lang.txt;
           q.options = json.questionlist[i].lang.options;
           qo.lang[language] = q;
         }
         s.questionlist[i] = qo;
       }
       return s;
     },
     error => {
       let errMsg = (error.message) ? error.message :
         error.status ? `${error.status} - ${error.statusText}` : 'Server error';
         return Observable.throw(false);
     });
 }



  /**
   * postSurvey
   *
   * @param Survey   a Survey model object holding the survey data one wants to post
   *
   * @returns Observable<boolean> returns an observable with the success status of the http post
   */
  postSurvey(survey: Survey): Observable<Survey> {
    let token = this.getToken();
    if (!token) {
      return Observable.throw('jwt not found'); // TODO: fix me.
    }

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);

    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(this.url, survey, options)
    .map( response => {
      let jsonResponse = response.json();
      if (response.status != 200){
        console.error(jsonResponse.status + " : " + jsonResponse.message);
        return false;
      }
      let json = response.json();
      let s = new Survey();
      s._id = json._id;
      s.name = json.name;
      s.date = json.date;
      s.active = json.active;
      s.questionlist = [];
      for (let i = 0; i<json.questionlist.length; i++) {
        let qo = new QuestionObject();
        qo.mode = json.questionlist.mode;
        qo.answer = json.questionlist.answer;
        qo.lang = new Lang();

        for (let language in json.questionlist[i].lang) {
          let q = new Question();
          q.txt = json.questionlist[i].lang.txt;
          q.options = json.questionlist[i].lang.options;
          qo.lang[language] = q;
        }
        s.questionlist[i] = qo;
      }
      console.info("post successful.");
      return s;
    },
    error => {
      let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(false);
    });
  }

  /**
   * patchSurvey
   *
   * @param Survey   a Survey model object holding the survey data one wants to patch
   *
   * @returns Observable<Survey> returns an observable with the success status of the http patch
   */
  patchSurvey(surveyId: string, survey: Survey): Observable<Survey> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.getToken()}`);

    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.patch(this.url + '/' + surveyId, survey, options)
      .map( response => {
        let jsonResponse = response.json();
        if (response.status != 200){
          console.error(jsonResponse.status + " : " + jsonResponse.message);
          return null;
        }
        console.info(jsonResponse.status + " : " + jsonResponse.message);
        return jsonResponse.survey;
      },
      error => {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
          return Observable.throw(false);
      });
  }

  /**
   * deleteSurvey
   *
   * @param idString   the id of the survey one wants to get
   *
   * @returns Observable<boolean> returns an observable with the success status of the http delete
   */
  deleteSurvey(surveyId: string): Observable<boolean> {
    let token = this.getToken();
    if (!token) {
      return Observable.throw('jwt not found'); // TODO: fix me.
    }

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${token}`);

    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.delete(this.url + '/' + surveyId, options)
      .map( response => {
        let jsonResponse = response.json();
        if (response.status != 200){
          console.error(jsonResponse.status + " : " + jsonResponse.message);
          return false;
        }
        console.info(jsonResponse.status + " : " + jsonResponse.message);
        return true;
      },
      error => {
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
          return Observable.throw(false);
      });
  }




  /**
   * getAllSurveys
   *
   * @returns Observable<SurveyList[]> returns an observable with a list of
   * objects with survey names, ids, active status and date.
   */
  getAllSurveys(): Observable<SurveyList[]>{
    let headers = new Headers()
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `${this.getToken()}`);

    return this.http.get(this.url, { headers })
      .map(
        response => {
          if (response.status != 200){
            // Error during login
            let jsonResponse = response.json();
            console.error(jsonResponse.status + " : " + jsonResponse.message);
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
        });
  }




}
