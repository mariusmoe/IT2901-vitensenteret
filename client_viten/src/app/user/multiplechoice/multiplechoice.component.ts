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
  selectedChoice;

  constructor() { }

  ngOnInit() {
    
  }

}
