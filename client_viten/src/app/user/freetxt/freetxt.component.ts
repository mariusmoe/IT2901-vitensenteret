import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-freetxt',
  templateUrl: './freetxt.component.html',
  styleUrls: ['./freetxt.component.scss']
})
export class FreetxtComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @Output() answer = new EventEmitter();
  public textValue = '';
  option;
  writtenAnswer;

  constructor() { }

  ngOnInit() {
    this.option = this.questionObject.lang.no.txt;
  }

  /**
   * This method emits the changes to its parent. The parent HTML listens for $event changes and call the addOrChangeAnswer(alt)
   * @param  {number[]} alt The output answer sent to active-survey-component
   */
  addChange(alt) {
    this.answer.emit(alt);
  }

/**
 * This updates the variables that posts to the active-survey component
 * @param  {number[]} userChoice An output number that shows which answer was chosen by a user
 */
  updateAnswers() {
    this.writtenAnswer = this.textValue;
    this.answer.emit(this.writtenAnswer);
  }

}
