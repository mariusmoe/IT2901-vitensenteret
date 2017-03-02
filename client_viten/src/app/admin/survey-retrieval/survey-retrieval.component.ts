import { Component, OnInit, Input } from '@angular/core';
import { Survey } from '../../_models/survey';

@Component({
  selector: 'app-survey-retrieval',
  templateUrl: './survey-retrieval.component.html',
  styleUrls: ['./survey-retrieval.component.scss']
})
export class SurveyRetrievalComponent implements OnInit {
  @Input() survey: Survey;

  chartType: String;
  chartTypes = [
    {value: 'bar-chart', viewValue: 'Bar Chart'},
    {value: 'doughnut-chart', viewValue: 'Doughnut Chart'}
  ];

  chartsToDisplay = [];

  constructor() { }

  ngOnInit() {
    for (const questionObject of this.survey.questionlist) {
      this.chartsToDisplay.push({
        'type': 'bar', // 'bar' or 'doughnut'
        'data': questionObject.answer,
      });
    }
  }

}
