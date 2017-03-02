import { Component, OnInit, Input } from '@angular/core';
import { Survey } from '../../_models/survey';

@Component({
  selector: 'app-survey-retrieval',
  templateUrl: './survey-retrieval.component.html',
  styleUrls: ['./survey-retrieval.component.scss']
})
export class SurveyRetrievalComponent implements OnInit {
  @Input() survey: Survey;

  chartsToDisplay = [];

  constructor() { }

  ngOnInit() {
    for (const questionObject of this.survey.questionlist) {
      this.chartsToDisplay.push(questionObject);
    }
  }

}
