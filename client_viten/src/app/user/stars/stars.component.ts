import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
  animations: [
  trigger('growShake', [
    state('inactive', style({opacity: 0.5, transform: 'scale(0.9,0.9)'})),
    state('active', style({opacity: 1, transform: 'scale(1,1)'})),
    transition('inactive => active', animate('500ms', keyframes([
      style({opacity: 0.5, transform: 'rotate(5deg)', offset: 0}),
      style({opacity: 1, transform: 'rotate(-5deg)', offset: 0.1}),
      style({opacity: 1, transform: 'rotate(5deg) scale(1.1,1.1)', offset: 0.2}),
      style({opacity: 1, transform: 'rotate(-5deg)', offset: 0.3}),
      style({opacity: 1, transform: 'rotate(5deg)', offset: 0.4}),
      style({opacity: 1, transform: 'rotate(-5deg)', offset: 0.5}),
      style({opacity: 1, transform: 'rotate(5deg)', offset: 0.6}),
      style({opacity: 1, transform: 'rotate(-5deg)', offset: 0.7}),
      style({opacity: 1, transform: 'rotate(5deg)', offset: 0.8}),
      style({opacity: 1, transform: 'rotate(-5deg)', offset: 0.9}),
      style({opacity: 1, transform: 'rotate(0deg)', offset: 1}),
    ]))),
    transition('active => inactive', animate('500ms'))
  ])
]
})
export class StarsComponent implements OnInit, OnDestroy {
  @Input() questionObject: QuestionObject;
  @Output() answer = new EventEmitter();
  selectedStar: number;
  private starList = [0, 1, 2, 3, 4];
  @Input() currentAnswer: number;

  starActiveOne = 'inactive';
  starActiveTwo = 'inactive';
  starActiveThree = 'inactive';
  starActiveFour = 'inactive';
  starActiveFive = 'inactive';
  private hasAnswered = false;
  constructor() {
  }

  ngOnInit() {
    this.hasAnswered = false;
    if (this.currentAnswer === 0) {
      this.starActiveOne = 'active';
    } else if (this.currentAnswer === 1) {
      this.starActiveOne = 'active';
      this.starActiveTwo = 'active';
    } else if (this.currentAnswer === 2) {
      this.starActiveOne = 'active';
      this.starActiveTwo = 'active';
      this.starActiveThree = 'active';
    } else if (this.currentAnswer === 3) {
      this.starActiveOne = 'active';
      this.starActiveTwo = 'active';
      this.starActiveThree = 'active';
      this.starActiveFour = 'active';
    } else if (this.currentAnswer === 4) {
      this.starActiveOne = 'active';
      this.starActiveTwo = 'active';
      this.starActiveThree = 'active';
      this.starActiveFour = 'active';
      this.starActiveFive = 'active';
    }
  }

  ngOnDestroy() {
    this.hasAnswered = false;
  }

  /**
   * This method emits the changes to its parent. The parent HTML listens for $event changes and call the addOrChangeAnswer(alt)
   * @param  {number[]} alt The output answer sent to active-survey-component
   */
  private addChange() {
    // console.log('Emiting now!')
    this.hasAnswered = true;
    this.answer.emit(this.selectedStar);
  }

  animationEnd(event) {
    if (event.fromState === 'inactive' || event.fromState === 'active') {
      if (!this.hasAnswered) {
        this.addChange();
      }
    }
  }

  /**
   * This method fills the stars with >= selectedIDStar and calls addChange()
   * @param  {number[]} selectedStar The selected answer ID
   * @return {[type]}              [description]
   */
  fillStar(selectedStar) {
    if (selectedStar === 0) {
      this.starActiveOne = 'active';
      this.starActiveTwo = 'inactive';
      this.starActiveThree = 'inactive';
      this.starActiveFour = 'inactive';
      this.starActiveFive = 'inactive';
    } else if (selectedStar === 1) {
      this.starActiveOne = 'active';
      this.starActiveTwo = 'active';
      this.starActiveThree = 'inactive';
      this.starActiveFour = 'inactive';
      this.starActiveFive = 'inactive';
    } else if (selectedStar === 2) {
      this.starActiveOne = 'active';
      this.starActiveTwo = 'active';
      this.starActiveThree = 'active';
      this.starActiveFour = 'inactive';
      this.starActiveFive = 'inactive';
    } else if (selectedStar === 3) {
      this.starActiveOne = 'active';
      this.starActiveTwo = 'active';
      this.starActiveThree = 'active';
      this.starActiveFour = 'active';
      this.starActiveFive = 'inactive';
    } else if (selectedStar === 4) {
      this.starActiveOne = 'active';
      this.starActiveTwo = 'active';
      this.starActiveThree = 'active';
      this.starActiveFour = 'active';
      this.starActiveFive = 'active';
    }
    this.selectedStar = selectedStar;
    // this.addChange(selectedStar);
  }
}
