import { Component, OnInit, Input } from '@angular/core';
import { Survey } from '../../_models/survey';
import { Response } from '../../_models/response';
import { TranslateService } from '../../_services/translate.service';

@Component({
  selector: 'app-survey-retrieval',
  templateUrl: './survey-retrieval.component.html',
  styleUrls: ['./survey-retrieval.component.scss']
})
export class SurveyRetrievalComponent implements OnInit {
  @Input() survey: Survey;
  @Input() responses: Response[];

  chartsToDisplay = [];

  constructor(public languageService: TranslateService) { }

  ngOnInit() {
    for (const questionObject of this.survey.questionlist) {
      this.chartsToDisplay.push(questionObject);
    }
  }

}
