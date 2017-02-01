import { Component } from '@angular/core';
import { Question } from '../classes/question';

@Component ({
  moduleId: module.id,
  selector: 'create-survey',
  templateUrl: '../templates/surveycreate.html',
  styleUrls: []
})

export class SurveyCreateComponent {

  questions: Question[] = [
    {type: 'multiple', text: 'Hvordan var dagen på vitensenteret?', subtext: 'yo', alternatives: ['nr1', 'nr2']}
  ];

  constructor(
  ){}

}
