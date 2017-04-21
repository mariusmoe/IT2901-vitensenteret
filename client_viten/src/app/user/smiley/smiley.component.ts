import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-smiley',
  templateUrl: './smiley.component.html',
  styleUrls: ['./smiley.component.scss'],
  animations: [
  trigger('jumpOut', [
    state('inactive', style({opacity: 0.8, transform: 'scale(0.9,0.9)'})),
    state('active', style({opacity: 1, transform: 'scale(1.1,1.1)'})),
    transition('inactive => active', animate('500ms', keyframes([
      style({opacity: 0.8, transform: 'scale(0.9,0.9)', offset: 0}),
      style({opacity: 0.9, transform: 'scale(1.4,1.2)', offset: 0.25}),
      style({opacity: 1, transform: 'scale(0.9,0.9)', offset: 0.8}),
      style({opacity: 1, transform: 'scale(1.1,1.1)', offset: 1.0})
    ]))),
    transition('active => inactive', animate('500ms'))
  ])
]
})
export class SmileyComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @Output() answer = new EventEmitter();
  selectedSmile: number;
  @Input() currentAnswer: number;

  // Animation variables
  smileyActiveOne = 'inactive';
  smileyActiveTwo = 'inactive';
  smileyActiveThree = 'inactive';

  constructor() {  }

  ngOnInit() {
    if (this.currentAnswer === 0) {
      this.smileyActiveOne = 'active';
    } else if (this.currentAnswer === 1) {
      this.smileyActiveTwo = 'active';
    } else if (this.currentAnswer === 2) {
      this.smileyActiveThree = 'active';
    }
  }

  /**
   * This method emits the changes to its parent. The parent HTML listens for $event changes and call the addOrChangeAnswer(alt)
   * @param  {number[]} alt The output answer sent to active-survey-component
   */
  addChange() {
    this.answer.emit(this.selectedSmile);
  }

  animationEnd(event) {
    if (event.fromState === 'inactive') {
      this.addChange();
    }
  }

  /**
   * This method selects the smiley and calls addChange()
   * @param  {number[]} selectedSmile The selected answer ID
   */
  selectSmile(selectedSmile) {

    // Animation triggers
    if (selectedSmile === 0) {
      this.smileyActiveOne = 'active';
      this.smileyActiveTwo = 'inactive';
      this.smileyActiveThree = 'inactive';
    }else if (selectedSmile === 1) {
      this.smileyActiveOne = 'inactive';
      this.smileyActiveTwo = 'active';
      this.smileyActiveThree = 'inactive';
    }else if (selectedSmile === 2) {
      this.smileyActiveOne = 'inactive';
      this.smileyActiveTwo = 'inactive';
      this.smileyActiveThree = 'active';
    }

    this.selectedSmile = selectedSmile;
    // this.addChange(this.selectedSmile);
  }
}
