import { Component, OnInit, Input } from '@angular/core';
import { QuestionObject } from '../../_models/survey';


@Component({
  selector: 'app-smiley',
  templateUrl: './smiley.component.html',
  styleUrls: ['./smiley.component.scss']
})
export class SmileyComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  
  constructor() {  }

  ngOnInit() {}
}
