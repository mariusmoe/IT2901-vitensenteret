import { Component, OnInit, trigger, state, transition, style, keyframes, animate, Input, Output, } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Survey, QuestionObject } from '../../_models/survey';
import { SimpleTimer } from 'ng2-simple-timer';
import 'hammerjs';


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
  private transition = false;
  private done = false;
  private answers = [];

  listenTimer: string;
  listenCounter = 0;

  endTimer: string;
  endCounter = 0;

  constructor(private surveyService: SurveyService,
    private router: Router, private route: ActivatedRoute, private timer: SimpleTimer) {

  }

  /**
   * ngOnInit
   * Take the URL and get the survey from url-Param
   */
  ngOnInit() {
    if (this.route.snapshot.params['surveyId']) {
      this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {
        if (!result) {
          console.log('DEBUG: BAD surveyId param from router!');
          // TODO: Redirect to base create survey ?
          return;
        }

        this.survey = result;
        this.totalPages = this.survey.questionlist.length;

        if (this.survey && this.survey.active) {
          this.properSurvey = true;
        } else {
          console.error('Survey is not active or something else is wrong!');
        }
      });
      return;
    }
  }
  /**
   * This method starts the survey as well as the inactivity timer
   */
  private startSurvey() {
    this.started = true;
    this.timer.newTimer('1sec', 1);
    this.subscribeListenTimer();
    this.subscribeEndTimer();
  }

/**
 * This method resets a survey
 */
  private exitSurvey() {
    this.started = false;
    this.properSurvey = false;
    this.page = 0;
    this.done = false;
    this.transition = false;

    if (this.route.snapshot.params['surveyId']) {
      this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {
        if (!result) {
          console.log ('DEBUG: BAD surveyId param from router!');
          return;
        }
        this.survey = result;
        this.totalPages = this.survey.questionlist.length;
        if (this.survey && this.survey.active) {
          this.properSurvey = true;
        }
      });
      return;
    }
  }

/**
 * This method adds/changes an answer with which answer-alternative the user chose
 * @param  {number[]} alternative a list of numbers to send to survey
 */
addOrChangeAnswer(alternative) {
  this.answers[this.page] = alternative;
}

/**
 * This method handles the transition to the previous questions in the survey
 * @return {undefined} Returns nothing just to prevent overflow
 */
  private previousQ() {
      if (this.page <= 0) {
        return;
      }
      this.page -= 1;
      this.transition = true;
    }

/**
 * This method handles the transition to the next question in the survey as well as handling whether its the last page.
 * @return {undefined} Returns nothing to prevent overflow
 */
  private nextQ() {
    // Handles an empty answer
    if (typeof this.answers[this.page] === 'undefined') {
      this.answers[this.page] = -1;
    }
    // If current page is the last with questions, the next page should be the endSurvey page
    if (this.page + 1 >= this.totalPages) {
      this.endSurvey();
      return;
    }
    // Advances to the next page
    this.page += 1;
    this.transition = true;
  }

  /**
   * This method checks if it should automatically advance to the next question.
   * If it is the last question in the survye, it should not advance.
   * @param  {}
   */
  autoAdvance() {
    if (this.page + 1 !== this.totalPages) {
      this.nextQ();
    }
  }

/**
 * This method ends the animation
 * @param  {$event} event An EventEmitter is taken as input from child-components
 */
  animEnd(event) {
    if (!event.fromState) {
      this.transition = false;
    }
  }

/**
 * The subscribe-methods connects variables to timers. These handles connectivity to callback-methods
 */
 subscribeListenTimer() {
  if (this.listenCounter) {
    // Unsubscribe if timer Id is defined
    this.timer.unsubscribe(this.listenTimer);
    this.listenTimer = undefined;
    } else {
    // Subscribe if timer Id is undefined
    this.listenTimer = this.timer.subscribe('1sec', e => this.listenCallback());
    }
  }
 subscribeEndTimer() {
  if (this.endCounter) {
    // Unsubscribe if timer Id is defined
    this.timer.unsubscribe(this.endTimer);
    this.endTimer = undefined;
    } else {
    // Subscribe if timer Id is undefined
    this.endTimer = this.timer.subscribe('1sec', e => this.endCallback());
    }
  }

/**
 * The timer-methods update the counters accordingly to realtime seconds
 */
 listenCallback() {
   this.listenCounter++;
   console.log('listencounter: ', this.listenCounter);
  }
  endCallback() {
    this.endCounter++;
    console.log('endcounter: ', this.endCounter);
  }
/**
 * This method resets the idle-timers
 * @return {[type]} [description]
 */
resetTimer() {
  this.listenCounter = 0;
  this.endCounter = 0;
}

/**
 * This method ends the survey if the user clicks the END button or after x amount of seconds
 */
  endSurvey() {
    this.postSurvey();
    this.answers = [];
    this.done = true;
  }

/**
 * This method quits the survey and routes it to the choose-survey component
 */
  quitSurvey() {
    this.router.navigate(['/choosesurvey']);
  }

/**
 * This method posts the survey to the database
 */
  private postSurvey() {
    this.surveyService.answerSurvey(this.answers, this.survey._id).subscribe((proper: boolean) => {
      this.properSurvey = true;
    });
  }

}
