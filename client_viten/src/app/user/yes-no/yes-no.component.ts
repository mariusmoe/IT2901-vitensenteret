import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-yes-no',
  templateUrl: './yes-no.component.html',
  styleUrls: ['./yes-no.component.scss'],
  animations: [
  trigger('jumpRotate', [
    state('inactive', style({opacity: 0.5})),
    state('active', style({opacity: 1, transform: 'scale(1.1,1.1)'})),
    transition('inactive => active', animate('500ms', keyframes([
      style({opacity: 0.5, transform: 'scale(1,1)', offset: 0}),
      style({opacity: 0.8, transform: 'scale(1.4,1.4) rotate(-15deg)', offset: 0.50}),
      style({opacity: 1, transform: 'scale(0.9,0.9) rotate(5deg)', offset: 0.75}),
      style({opacity: 1, transform: 'scale(1.1,1.1)', offset: 1.0})
    ]))),
    transition('active => inactive', animate('500ms'))
  ])
]
})
export class YesNoComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @Output() answer = new EventEmitter();
  selectedAnswer: number;
  @Input() currentAnswer: number;

  // Animation variables
  thumbActiveOne = 'inactive';
  thumbActiveTwo = 'inactive';

  constructor() { }

  ngOnInit() {
    if (this.currentAnswer === 0) {
      this.thumbActiveOne = 'active';
    } else if (this.currentAnswer === 1) {
      this.thumbActiveTwo = 'active';
    }
  }

  /**
   * This method selects the thumb-answer and calls addChange()
   * @param  {number[]} selectedAnswer The output answer sent to active-survey-component
   */
  selectAnswer(selectedAnswer) {

    // Animation triggers

    if (selectedAnswer === 0) {
      this.thumbActiveOne = 'active';
      this.thumbActiveTwo = 'inactive';
    } else if (selectedAnswer === 1) {
      this.thumbActiveOne = 'inactive';
      this.thumbActiveTwo = 'active';
    }

    this.selectedAnswer = selectedAnswer;
    // this.addChange(this.selectedAnswer);
  }

  /**
   * This method emits the changes to its parent. The parent HTML listens for $event changes and call the addOrChangeAnswer(alt)
   * @param  {number[]} alt The selected answer ID
   */
  addChange() {
    this.answer.emit(this.selectedAnswer);
  }

  animationEnd(event) {
    if (event.fromState === 'inactive') {
      this.addChange();
    }
  }

}
