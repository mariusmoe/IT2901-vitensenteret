import { Component, OnInit, Input } from '@angular/core';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {
  @Input() questionObject: QuestionObject;

  constructor() { }

  ngOnInit() {
  }

}
