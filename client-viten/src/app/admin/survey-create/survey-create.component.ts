import { Component, OnInit } from '@angular/core';
import { Question } from '../../_models/question';

@Component({
  selector: 'app-survey-create',
  templateUrl: './survey-create.component.html',
  styleUrls: ['./survey-create.component.scss']
})
export class SurveyCreateComponent implements OnInit {

  /**
  * List of question types
  * q_type: DB values
  * q_type_name: Frontend values
  */
  q_type: string[] = ['multi', 'smily', 'star', 'text'];
  q_type_name: string[] = ['MultipleChoice', 'SmilyFace', '5-Stars', 'TextBlock'];

  /**
  * List of variables used to define the survey
  * surveyname: The surveys name
  * surveyname_e: The surveys english name
  * questions: The list of questions in the survey
  * english: Boolean defining if survey has english as 2. language
  */
  surveyname: string = '';
  surveyname_e: string = '';
  questions: Question[] = [];
  english: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  /**
  * Adds a question to the survey.
  */
  addQuestion(): void {
    this.questions.push({type: 'multi', text: '', text_e: '', subtext: '', subtext_e: '', alternaltives: [{alt: '', alt_e: ''}]});
  }

  /**
  * Adds an alternaltive to the SELECTED question.
  */
  addAlternaltive(question: Question): void {
    question.alternaltives.push({alt: '', alt_e: ''});
  }

  /**
  * Deletes the SELECTED question.
  */
  deleteQuestion(index: number): void {
    this.questions.splice(index, 1);
    //TODO: Popup confirmation
  }

  /**
  * Deletes the SELECTED alternaltive from the SELECTED question.
  */
  deleteAlternaltive(question: Question, index: number): void {
    question.alternaltives.splice(index, 1);
  }

}
