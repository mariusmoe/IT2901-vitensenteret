import { Component, OnInit, Input } from '@angular/core';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-yes-no',
  templateUrl: './yes-no.component.html',
  styleUrls: ['./yes-no.component.scss']
})
export class YesNoComponent implements OnInit {
  @Input() questionObject: QuestionObject;

  constructor() { }

  ngOnInit() {
  }

}
