import { Component, OnInit } from '@angular/core';
import { Question } from '../../_models/question';

@Component({
  selector: 'app-survey-create',
  templateUrl: './survey-create.component.html',
  styleUrls: ['./survey-create.component.scss']
})
export class SurveyCreateComponent implements OnInit {

  q_type: string[] = ['multi', 'smily', 'star', 'text'];

  surveyname: string = '';
  surveyname_e: string = '';
  questions: Question[] = [];
  english: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  addQuestion(): void {
    this.questions.push({type: 'multi', text: '', text_e: '', subtext: '', subtext_e: '', alternaltives: [{alt: '', alt_e: ''}]});
  }

  addAlternaltive(question: Question): void {
    question.alternaltives.push({alt: '', alt_e: ''});
  }

  deleteQuestion(index: number): void {
    this.questions.splice(index, 1);
    //TODO: Popup confirmation
  }

  deleteAlternaltive(question: Question, index: number): void {
    question.alternaltives.splice(index, 1);
  }

}
