import { Component, OnInit, Input, } from '@angular/core';
import { SurveyList } from '../../../_models/index';
import { SurveyService } from '../../../_services/survey.service';

@Component({
  selector: 'app-little-survey',
  templateUrl: './little-survey.component.html',
  styleUrls: ['./little-survey.component.scss']
})
export class LittleSurveyComponent implements OnInit {

  @Input() survey: SurveyList;


  constructor(private surveyService: SurveyService) { }

  ngOnInit() {
  }

  select(surveyId: string) {
    this.surveyService.selectSurvey(surveyId);
}


}
