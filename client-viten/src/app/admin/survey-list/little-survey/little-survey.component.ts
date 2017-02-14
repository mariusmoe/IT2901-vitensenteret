import { Component, OnInit, Input } from '@angular/core';
import { SurveyList } from '../../../_models/index';

@Component({
  selector: 'app-little-survey',
  templateUrl: './little-survey.component.html',
  styleUrls: ['./little-survey.component.scss']
})
export class LittleSurveyComponent implements OnInit {

  @Input() survey: SurveyList;


  constructor() { }

  ngOnInit() {
  }



}
