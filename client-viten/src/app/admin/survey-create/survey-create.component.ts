import { Component, OnInit } from '@angular/core';
import { Questio } from '../../_models/question';
import { SurveyService } from '../../_services/survey.service';
import { Survey, QuestionObject, Lang, Question } from '../../_models/survey';

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
  questions: Questio[] = [];
  english: boolean = false;

  constructor(
    private surveyService: SurveyService
  ) { }

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
  addAlternaltive(question: Questio): void {
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
  deleteAlternaltive(question: Questio, index: number): void {
    question.alternaltives.splice(index, 1);
  }


  pushSurvey(): void {

    let s = new Survey();
    s.active = true;
    s.name = this.surveyname;
    s.date = "2012-04-23T18:25:43.511Z";
    s.questionlist = [];

    for (let q of this.questions) {
      let qo = new QuestionObject();
      qo.mode = q.type;
      qo.answer = [];
      qo.lang = new Lang();
      qo.lang.no = new Question();
      qo.lang.no.txt = q.text;

      if (this.english) {
        qo.lang.en = new Question();
        qo.lang.en.txt = q.text_e;
      }

      for (let a of q.alternaltives) {
        //TODO: remove this
        qo.lang.no.options = ['1', '2'];
        //qo.lang.no.options.push(a.alt);
        if (this.english) {
          //TODO: remove this
          qo.lang.en.options = ['1', '2'];
          //qo.lang.en.options.push(a.alt_e);
        }
      }
      s.questionlist.push(qo);
    }

    this.surveyService.postSurvey(s).subscribe(result => {
      if (result) {
        console.log('happy');
      }
      else {
        console.log('whops');
      }
    });


  }

}
