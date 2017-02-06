import { Component, OnInit } from '@angular/core';
import { Question } from '../../classes/question';

@Component({
  selector: 'app-survey-create',
  templateUrl: './survey-create.component.html',
  styleUrls: ['./survey-create.component.scss']
})
export class SurveyCreateComponent implements OnInit {

  surveyname: string = '';
  questions: Question[] = [];

  constructor() { }

  ngOnInit() {
  }

  addQuestion(): void {
    this.questions.push({type: '', text: '', subtext: '', alternaltives: [{alt: ''}]});
  }

  addAlternaltive(question: Question): void {
    question.alternaltives.push({alt: ''});
  }

  deleteQuestion(index: number): void {
    this.questions.splice(index, 1);
    //TODO: Popup confirmation
  }

  deleteAlternaltive(question: Question, index: number): void {
    question.alternaltives.splice(index, 1);
  }

}
