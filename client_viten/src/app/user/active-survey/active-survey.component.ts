import { Component, OnInit, trigger, state, transition, style, keyframes, animate, Input, Output, } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Survey, QuestionObject } from '../../_models/survey';


@Component({
  selector: 'active-survey',
  templateUrl: './active-survey.component.html',
  styleUrls: ['./active-survey.component.scss'],
  animations: [
    trigger('easeInOut', [
      state('void', style({'opacity': 0})),
      transition(':enter', animate('0.5s ease-in-out', style({'opacity': 1}))),
      transition(':leave', animate('0.5s ease-in-out', style({'opacity': 0})))
    ])
  ]
})

export class ActiveSurveyComponent implements OnInit {
  @Input() alternative: number;
  private properSurvey = false;
  private started = false;
  private survey: Survey;
  private page = 0;
  private totalPages = 0;
  private nextPage = 0;
  private transition = false;
  private forwardValue = 'Forward';
  private done = false;
  private answers = [];

  constructor(private surveyService: SurveyService,
    private router: Router, private route: ActivatedRoute) {

  }


  ngOnInit() {
    if (this.route.snapshot.params['surveyId']) {
      this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {
        if (!result) {
          // console.log("DEBUG: BAD surveyId param from router!");
          // TODO: Redirect to base create survey ?
          return;
        }
        this.survey = result;
        this.totalPages = this.survey.questionlist.length;

        if (this.survey && this.survey.active) {
          // console.log(this.survey);
          this.properSurvey = true;
        }
      });
      return;
    }
  }
  private startSurvey() {
    this.started = true;
  }

  private exitSurvey() {
    this.forwardValue = 'Forward';
    this.started = false;
    this.properSurvey = false;
    this.page = 0;
    this.nextPage = 0;
    this.done = false;
    this.transition = false;
    if (this.route.snapshot.params['surveyId']) {
      this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {
        if (!result) {
          // console.log("DEBUG: BAD surveyId param from router!");
          // TODO: Redirect to base create survey ?
          return;
        }
        this.survey = result;
        this.totalPages = this.survey.questionlist.length;

        if (this.survey && this.survey.active) {
          // console.log(this.survey);
          this.properSurvey = true;
        }
      });
      return;
    }
  }

// This method adds/changes an answer with which answer-alternative the user chose
addOrChangeAnswer(alternative) {
  this.answers[this.page] = alternative;
  console.log('answers updated! answer[] now looks like this: ', this.answers);
}

// This method handles the transition to the previous questions in the survey
  private previousQ() {
      if (this.page <= 0) {
        // console.log("this is the first question, can't go back further");
        return;
      }
      this.forwardValue = 'Forward';
      this.page -= 1;
      this.transition = true;

      // console.log('previous question');
    }

// This method handles the transition to the next question in the survey
  private nextQ() {
    if (typeof this.answers[this.page] === 'undefined') {
      this.answers[this.page] = -1;
      console.log('answers updated! answer[] now looks like this: ', this.answers);
    }
    if (this.forwardValue === 'Finish') {
      this.endSurvey();
    }
    if (this.page + 1 >= this.totalPages) {
      // console.log("this is the last question, can't advance further");
      this.forwardValue = 'Finish';
      return;
    }
    this.forwardValue = 'Forward';
    this.page += 1;
    this.transition = true;

    if (this.page + 1 >= this.totalPages) {
      this.forwardValue = 'Finish';
    }
    // console.log('next question');
  }

// This method ends the animation
  animEnd(event) {
    if (!event.fromState) {
      this.transition = false;
      // console.log("Going to next page now!")
    }
    // console.log('animEnd');
    // console.log(event);
  }

// This method ends the survey if the user clicks the END button or after x amount of seconds
  endSurvey() {
    console.log(this.answers);
    this.postSurvey();
    this.answers = [];
    this.done = true;
  }

// This method quits the survey and routes it to the choose-survey component
  quitSurvey() {
    // Route to the select-survey window
    this.postSurvey();
    this.router.navigate(['/choosesurvey']);
    console.log('Routing to select-survey');
    return;
  }

// This method posts the survey to the database
  private postSurvey() {
    this.surveyService.answerSurvey(this.answers, this.survey._id).subscribe((proper:boolean) => {
      this.properSurvey = true;
    });
  }

}
