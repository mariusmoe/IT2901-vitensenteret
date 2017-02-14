import 'rxjs/add/operator/switchMap';

import { Component, OnInit } from '@angular/core';
import { SurveyList } from '../../_models/index';
import { SurveyService } from '../../_services/survey.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-all-surveys',
  templateUrl: './all-surveys.component.html',
  styleUrls: ['./all-surveys.component.scss']
})
export class AllSurveysComponent implements OnInit {


    private surveys: SurveyList[] = [];

    private loading: boolean = false;

    private selectedID: string = "";


    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private surveyService: SurveyService) {

      }

    ngOnInit() {
      this.getSurveys();
      if (this.route.snapshot.params['surveyId']){
        console.log(this.route.snapshot.params['surveyId'])
        this.setSelectedID(this.route.snapshot.params['surveyId']);
      }
    }

    /**
     * Set the selected ID
     *
     * Set the selected survey if it is provided in the url
     * @param  {string} selectedID surveyID to use
     */
    setSelectedID(selectedID: string){
      this.selectedID = selectedID;
    }

    /**
     * Select one survey form the list
     * @param  {string} surveyId [description]
     * @return {[type]}          [description]
     */
    select(surveyId: string) {
      this.selectedID = surveyId;
      this.router.navigate(['/admin', surveyId]);
      this.surveyService.selectSurvey(surveyId);
    }

    /**
     * get all surveys as a list
     */
    private getSurveys() {
      this.loading = true;
      this.surveyService.getAllSurveys().subscribe(result => {
        this.surveys = result;
        this.loading = false;
      })
    }

}
