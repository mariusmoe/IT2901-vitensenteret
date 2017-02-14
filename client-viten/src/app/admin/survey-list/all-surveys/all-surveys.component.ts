import { Component, OnInit } from '@angular/core';
import { SurveyList } from '../../../_models/index';
import { SurveyService } from '../../../_services/survey.service';


@Component({
  selector: 'app-all-surveys',
  templateUrl: './all-surveys.component.html',
  styleUrls: ['./all-surveys.component.scss']
})
export class AllSurveysComponent implements OnInit {


    private surveys: SurveyList[] = [];

    private loading: boolean = false;

    constructor(
      private surveyService: SurveyService) {

      }

    ngOnInit() {
      this.getSurveys();
    }


    private getSurveys() {
      this.loading = true;
      this.surveyService.getAllSurveys().subscribe(result => {
        this.surveys = result;
        this.loading = false;
      })
    }

}
