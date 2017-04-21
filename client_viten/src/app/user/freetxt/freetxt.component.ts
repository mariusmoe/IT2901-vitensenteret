import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionObject } from '../../_models/survey';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-freetxt',
  templateUrl: './freetxt.component.html',
  styleUrls: ['./freetxt.component.scss']
})
export class FreetxtComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @Output() answer = new EventEmitter();
  public textValue;
  key;
  savedTxt;
  textControl;
  @Input() currentAnswer: string;

  constructor() {
    this.textControl = new FormControl();
  }

  ngOnInit() {
    this.textValue = this.currentAnswer;
    // Listens to changes in the textbox
    this.textControl.valueChanges.subscribe(value => {
      this.updateAnswers();
    });
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
    if (this.textValue === '') {
      this.answer.emit(null);
    } else {
      this.answer.emit(this.textValue);
    }
  }

}
