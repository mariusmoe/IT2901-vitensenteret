import { Component, OnInit, Input } from '@angular/core';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-multiplechoice',
  templateUrl: './multiplechoice.component.html',
  styleUrls: ['./multiplechoice.component.scss']
})
export class MultiplechoiceComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  
  constructor() { }

  ngOnInit() {
  }

}
