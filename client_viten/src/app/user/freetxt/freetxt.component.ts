import { Component, OnInit, Input } from '@angular/core';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-freetxt',
  templateUrl: './freetxt.component.html',
  styleUrls: ['./freetxt.component.scss']
})
export class FreetxtComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  
  constructor() { }

  ngOnInit() {
  }

}
