import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { QuestionObject } from '../../_models/survey';
import { TranslateService } from '../../_services/translate.service';

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.scss']
})
export class NicknameComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @Output() answer = new EventEmitter();
  public textValue;
  key;
  savedTxt;

  constructor(public translateService: TranslateService) { }

  ngOnInit() {
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
      this.answer.emit(this.textValue);
      localStorage.setItem(this.key, this.textValue);
    }

}
