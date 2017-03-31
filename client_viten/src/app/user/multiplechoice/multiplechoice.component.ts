import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-multiplechoice',
  templateUrl: './multiplechoice.component.html',
  styleUrls: ['./multiplechoice.component.scss']
})
export class MultiplechoiceComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @Output() answer = new EventEmitter();
  options;
  answerList = [];
  checkModels = [];
  @Input() currentAnswer = [];

  constructor() { }

  ngOnInit() {
    this.options = this.questionObject.lang.no.options;
    this.options.forEach(o => this.checkModels.push(false) );
    if (this.currentAnswer) {
      for (let i = 0; i < this.currentAnswer.length; i++) {
        this.checkModels[this.currentAnswer[i]] = true;
      }
    }
  }

/**
 * This updates the variables that posts to the active-survey component
 * @param  {number[]} userChoice An output number that shows which answer was chosen by a user
 */
  updateAnswers() {
    this.answerList = [];
    this.checkModels.forEach((c, i) => {
      if (c) {
        this.answerList.push(i);
      }
    });

    // Important for the required logic in active-survey
    if (this.answerList[0] == null) {
      this.answerList = null;
    }

    this.answer.emit(this.answerList);
  }
}
