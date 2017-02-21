import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Survey, QuestionObject } from '../../_models/survey';


@Component({
  selector: 'active-survey',
  templateUrl: './active-survey.component.html',
  styleUrls: ['./active-survey.component.scss']
})
export class ActiveSurveyComponent implements OnInit {
  private properSurvey: boolean = false;
  private started: boolean = false;
  private survey: Survey;
  private page: number = 0;

  constructor(private surveyService: SurveyService,
    private router: Router, private route: ActivatedRoute) {

  }


  ngOnInit() {
    if (this.route.snapshot.params['surveyId']){
      this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {
        if (!result) {
          console.log("DEBUG: BAD surveyId param from router!");
          // TODO: Redirect to base create survey ?
          return;
        }
        this.survey = result;

        if (this.survey && this.survey.active) {
          console.log(this.survey);
          this.properSurvey = true;
        }
      });
      return;
    }
  }
  private startSurvey(){
    this.started = true;
  }
}
