import { Component } from '@angular/core';
import { Question } from '../classes/question';

@Component ({
  moduleId: module.id,
  selector: 'create-survey',
  templateUrl: '../templates/surveycreate.html',
  styleUrls: []
})

export class SurveyCreateComponent {

  questions: Question[] = [];

  constructor(
  ){}

  addQuestion(): void {
    this.questions.push({type: '', text: '', subtext: '', alternaltives: ['']});
  }

  addAlternaltive(question: Question): void {
    question.alternaltives.push('');
  }

}
