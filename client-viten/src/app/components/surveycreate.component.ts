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
    this.questions.push({type: '', text: '', subtext: '', alternaltives: [{alt: ''}]});
  }

  addAlternaltive(question: Question): void {
    question.alternaltives.push({alt: ''});
  }

  deleteQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  deleteAlternaltive(question: Question, index: number): void {
    question.alternaltives.splice(index, 1);
  }

}
