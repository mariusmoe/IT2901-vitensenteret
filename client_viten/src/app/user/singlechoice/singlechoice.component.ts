import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-single-choice',
  templateUrl: './singlechoice.component.html',
  styleUrls: ['./singlechoice.component.scss']
})
export class SinglechoiceComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @Output() answer = new EventEmitter();
  selectedOption: string;
  options;
  @Input() currentAnswer: number;

  constructor() { }

  ngOnInit() {
    this.options = this.questionObject.lang.no.options;
    this.selectedOption = this.options[this.currentAnswer];
  }
/**
 * This posts to the answer-list in active-survey component
 * @param  {number[]} alt The output answer sent to active-survey-component
 */
  postAnswer(alt) {
    this.answer.emit(alt);
  }
/**
 * This updates the local variable that posts to the active-survey component
 * @param  {number[]} userChoice An output number that shows which answer was chosen by a user
 */
  updateAnswers(userChoice) {
    this.postAnswer(userChoice);
  }
}
