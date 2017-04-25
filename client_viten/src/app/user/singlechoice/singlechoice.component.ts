import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';
import { QuestionObject } from '../../_models/survey';
import { TranslateService } from '../../_services/translate.service';

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

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    if (this.translateService.getCurrentLang() === 'en') {
      this.options = this.questionObject.lang.en.options;
    } else {
      this.options = this.questionObject.lang.no.options;
    }
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
 * @param  {number[]} option An output number that shows which answer was chosen by a user
 */
  updateAnswers(option) {
    if (this.translateService.getCurrentLang() === 'en') {
      this.postAnswer(this.questionObject.lang.en.options.indexOf(option));
    } else {
      this.postAnswer(this.questionObject.lang.no.options.indexOf(option));
    }
  }
}
