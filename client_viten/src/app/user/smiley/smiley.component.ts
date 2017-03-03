import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionObject } from '../../_models/survey';
// import { ActiveSurveyComponent } from '../active-survey/active-survey';


@Component({
  selector: 'app-smiley',
  templateUrl: './smiley.component.html',
  styleUrls: ['./smiley.component.scss']
})
export class SmileyComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @Output() answer = new EventEmitter();

  constructor() {  }

  ngOnInit() {}

  addChange(alt){
    console.log('Answer changed');
    this.answer.emit(alt);
  }
}
