import { Component, OnInit } from '@angular/core';
import { Surveys } from '../../_models/surveys';


@Component({
  selector: 'app-choose-survey',
  templateUrl: './choose-survey.component.html',
  styleUrls: ['./choose-survey.component.scss']
})
export class ChooseSurveyComponent implements OnInit {

  surveys: Surveys[]=[{id: 1, name: 'Utgang'}, {id: 2, name: 'Graviton'}];
  



  constructor(){ }

  ngOnInit() {
  }





}
