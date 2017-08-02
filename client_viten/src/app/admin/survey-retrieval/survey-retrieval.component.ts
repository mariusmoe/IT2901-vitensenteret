import { Component, OnInit, Input } from '@angular/core';
import { Survey } from '../../_models/survey';
import { Response } from '../../_models/response';

@Component({
  selector: 'app-survey-retrieval',
  templateUrl: './survey-retrieval.component.html',
  styleUrls: ['./survey-retrieval.component.scss']
})
export class SurveyRetrievalComponent implements OnInit {
  @Input() survey: Survey;
  @Input() postSurvey: Survey;
  @Input() responses: Response[];
  @Input() postResponses: Response[];

  chartsToDisplay = [];
  chartsToDisplay2 = []; // remains empty if prePostEqual === false

  prePostEqual = true;

  constructor() {}

  ngOnInit() {
    if (this.survey && this.postSurvey) {
      if (this.survey.questionlist.length === this.postSurvey.questionlist.length) {
        this.prePostEqual = !this.survey.questionlist.some((qo, i, array) => {
          const qo2 = this.postSurvey.questionlist[i];
          return (qo.mode !== qo2.mode);
        });
      } else {
        this.prePostEqual = false;
      }
    }
    for (const questionObject of this.survey.questionlist) {
      this.chartsToDisplay.push(questionObject);
    }
    if (!this.prePostEqual && this.postSurvey) {
      for (const questionObject of this.postSurvey.questionlist) {
        this.chartsToDisplay2.push(questionObject);
      }
    }
  }

}
