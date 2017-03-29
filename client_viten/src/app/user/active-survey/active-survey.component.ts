import { Component, OnInit, trigger, state, transition, style, keyframes, animate, Input, Output, HostListener } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { Response } from '../../_models/response';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Survey, QuestionObject } from '../../_models/survey';
import { SimpleTimer } from 'ng2-simple-timer';
import { MdDialog } from '@angular/material';
import { QuitsurveyPromptComponent } from './quitsurvey-prompt.component';
import { TranslateService } from '../../_services/translate.service';


@Component({
  selector: 'active-survey',
  templateUrl: './active-survey.component.html',
  styleUrls: ['./active-survey.component.scss'],
  animations: [
    trigger('easeInOut', [
      state('void', style({'opacity': 0})),
      transition(':enter', animate('0.5s ease-in-out', style({'opacity': 1}))),
      transition(':leave', animate('0.5s ease-in-out', style({'opacity': 0})))
    ]),
    trigger('selectLang', [
      state('active', style({opacity: 1, transform: 'scale(1.1)'})),
      state('inactive', style({opacity: 0.5})),
      transition('inactive => active', animate('200ms', keyframes([
        style({opacity: 1, transform: 'scale(1.5)', ofset: 0.3}),
        style({opacity: 1, transform: 'scale(1.5)', ofset: 0.5}),
        style({opacity: 1, transform: 'scale(1.1)', ofset: 0.7}),
        style({opacity: 1, transform: 'scale(1.1)', ofset: 1})
      ]))),
      transition('active => inactive', animate('50ms'))
    ]),
    trigger('shakeArrow', [
      state('active', style({})),
      state('inactive', style({})),
      transition('inactive => active', animate('1000ms', keyframes([
        style({transform: 'translateX(0)', ofset: 0}),
        style({transform: 'translateX(0)', ofset: 0.1}),
        style({transform: 'translateX(2%)', ofset: 0.2}),
        style({transform: 'translateX(4%)', ofset: 0.3}),
        style({transform: 'translateX(6%)', ofset: 0.4}),
        style({transform: 'translateX(8%)', ofset: 0.5}),
        style({transform: 'translateX(10%)', ofset: 0.6}),
        style({transform: 'translateX(6%)', ofset: 0.7}),
        style({transform: 'translateX(2%)', ofset: 0.8}),
        style({transform: 'translateX(0)', ofset: 0.9}),
        style({transform: 'translateX(0)', ofset: 1}),
      ]))),
      transition('active => inactive', animate('500ms', keyframes([
        style({transform: 'rotate(0)', ofset: 0}),
        style({transform: 'rotate(2deg)', ofset: 0.1}),
        style({transform: 'rotate(-2deg)', ofset: 0.2}),
        style({transform: 'rotate(2deg)', ofset: 0.3}),
        style({transform: 'rotate(-2deg)', ofset: 0.4}),
        style({transform: 'rotate(2deg)', ofset: 0.5}),
        style({transform: 'rotate(-2deg)', ofset: 0.6}),
        style({transform: 'rotate(2deg)', ofset: 0.7}),
        style({transform: 'rotate(-2deg)', ofset: 0.8}),
        style({transform: 'rotate(2deg)', ofset: 0.9}),
        style({transform: 'rotate(0)', ofset: 1}),
      ])))
    ]),
    trigger('playGrow', [
      state('active', style({transform: 'scale(1.05)'})),
      state('inactive', style({transform: 'scale(0.95)'})),
      transition('inactive => active', animate('2500ms ease-in-out', keyframes([
        style({opacity: 1, transform: 'scale(0.95)', ofset: 0.1}),
        style({opacity: 1, transform: 'scale(1.05)', ofset: 1})
      ]))),
      transition('active => inactive', animate('2500ms ease-in-out', keyframes([
        style({opacity: 1, transform: 'scale(1.05)', ofset: 0.1}),
        style({opacity: 1, transform: 'scale(0.95)', ofset: 1})
      ]))),
    ]),
  ]
})

export class ActiveSurveyComponent implements OnInit {
  @Input() alternative: number; // The answer- \input recieved from child components.
  private properSurvey = false; // If the survey is valid, posting it to the database is possible.
  private started = false; // If a survey is started, this is true.
  private survey: Survey; // The survey-object which is used to access information about the survey
  private response: Response; // The reposne-object that is used to control all user input
  private page = 0; // The current page the user is on
  private totalPages = 0; // The total amount of pages in the survey
  private transition = false; // If true, animation between pages are triggerd
  private noreqans = false; // If true, there is no answer for required question, and right arrow is disabled
  private englishEnabled: boolean;
  private Twolanguage = true;
  showmodal = true; // This controls if theere should be and error message overlay

  private done = false; // if true it takes you to the endMessage-screen
  postDone; /* postDone is a boolean that tells if the pre-post has been handled.
               Is only initialized if survey is pre/post. Set to true in html.*/
  nicknamePage; // Only initialized if pre-post. Is true when the user is on the nickname page.

  abortTimer: string; // The ID for the timer
  abortCounter = 0; // The actual timer, updates in the listenCallback() function
  public startText = 'Start survey';

  // Animation variables
  flagActiveEnglish = 'inactive';
  flagActiveNorwegian = 'inactive';
  lastQuestionAnswered = 'inactive';
  animLoop = false;
  playButtonActive = 'inactive';


  /**
   * Hostlistener that recognizes clicks on the screen to reset timer
   * @param  {click'} 'document  [description]
   * @param  {[type]} ['$event'] [description]
   * @return {[type]}            [description]
   */
  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.resetTimer();
  }

  /**
   * Hostlistener that recognizes keypresses to reset timer
   * @param  {keypress'} 'document  [description]
   * @param  {[type]}    ['$event'] [description]
   * @return {[type]}               [description]
   */
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.resetTimer();
  }

  constructor(private surveyService: SurveyService,
    private router: Router,
    private route: ActivatedRoute,
    private timer: SimpleTimer,
    public dialog: MdDialog,
    public translateService: TranslateService) {
  }

  /**
   * ngOnInit
   * Take the URL and get the survey from url-Param
   */
  ngOnInit() {
    // Sets default language to Norwegian at startup
    this.switchtono();
    if (this.route.snapshot.params['surveyId']) {
      const sub = this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {
        sub.unsubscribe();

        if (!result) {
          console.log('DEBUG: BAD surveyId param from router!');
          // TODO: Redirect to base create survey ?
          return;
        }
        this.survey = result.survey;
        if (!this.survey.active) {
          this.router.navigate(['/choosesurvey']);
        }
        this.response = <Response> {
            nickname: undefined,
            questionlist: [],
            surveyId: this.survey._id,
        };
        this.totalPages = this.survey.questionlist.length;

        // Sets the language to no as standard when it is created
        // this.language = this.survey.questionlist[this.page].lang.no.txt;
        //this.switchtono();
        // somewhat hacky way to determine english state.
        if (this.survey.questionlist[0].lang.en
          && this.survey.questionlist[0].lang.en.txt
          && this.survey.questionlist[0].lang.en.txt.length > 0) {
          this.englishEnabled = true;
          console.log('This survey have english ');
        }



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
    // Checks if the survey is inactive
    if (this.route.snapshot.params['surveyId']) {
      const sub = this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {

        sub.unsubscribe();

        if (!result.survey.active) {
          this.showModal();
          return;
        }
        this.started = true;
        if (this.survey.isPost || this.survey.postKey !== undefined) {
          this.postDone = false;
        }
        this.timer.newTimer('idleTimer', 1);
        this.subscribeabortTimer();
        // This method checks if a qestion is required and has been answered
        if (this.survey.questionlist[this.page].required) {
          if (this.response.questionlist[this.page] == null) {
            this.noreqans = true;
          } else {
            this.noreqans = false;
          }
        } else {
          this.noreqans = false;
        }



      });
    }
  }

/**
 * This method resets a survey completely
 */
  private exitSurvey() {
    console.log('survey is done');
    this.started = false;
    this.properSurvey = false;
    this.page = 0;
    this.done = false;
    this.transition = false;
    this.nicknamePage = undefined;
    this.postDone = undefined;
    this.response.nickname = undefined;

    this.response.questionlist = [];
    // Animation variable
    this.lastQuestionAnswered = 'inactive';
    this.animLoop = false;

    this.subscribeabortTimer();
    this.timer.delTimer('idleTimer');

    if (this.route.snapshot.params['surveyId']) {
      const sub = this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {
        sub.unsubscribe();
        if (!result) {
          console.log ('DEBUG: BAD surveyId param from router!');
          return;
        }
        this.survey = result.survey;
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
 * @param  {any} alternative a list of numbers to send to survey
 */
addOrChangeAnswer(alternative: any) {
  if (this.page + 1 === this.totalPages && this.response.questionlist[this.page] == null) {
    this.animLoop = true;
    this.lastQuestionAnswered = 'active';
    this.noreqans = false;
  }
  this.response.questionlist[this.page] = alternative;
}
   /**
    * Updates the nickname in Response
    * @param  {[type]} nickname [description]
    * @return {[type]}          [description]
    */
   checkNick(nickname) {
     this.response.nickname = nickname;
   }

/**
 * This method handles the transition to the previous questions in the survey
 * @return {undefined} Returns nothing just to prevent overflow
 */
  private previousQ() {
    console.log('previous question');
    if (this.page <= 0) {
      return;
    }
    if (this.nicknamePage) {
      this.nicknamePage = false;
      this.transition = true;
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
    console.log('next question');
    // Handles an empty answer
    if (typeof this.response.questionlist[this.page] === 'undefined') {
      this.response.questionlist[this.page] = -1;
    }
    // If current page is the last with questions, the next page should be the endSurvey page
    if (this.page + 1 >= this.totalPages) {
      if (this.survey.postKey !== undefined || this.survey.isPost) {
        console.log('pre-survey is available');
        this.nicknamePage = true;
      }
      this.endSurvey();
      this.transition = true;
      return;
    }
    // Advances to the next page
    this.page += 1;
    this.transition = true;
  }

  /**
   * This method checks if it should automatically advance to the next question.
   * If it is the last question in the survey, it should not advance.
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
      // This method checks if a qestion is required and has been answered
      if (this.survey.questionlist[this.page].required) {
        if (this.response.questionlist[this.page] == null) {
          this.noreqans = true;
        } else {
          this.noreqans = false;
        }
      } else {
        this.noreqans = false;
      }
    }
  }

/**
 * The subscribe-methods connects variables to timers. These handles connectivity to callback-methods
 */
 subscribeabortTimer() {
  if (this.abortTimer) {
    // Unsubscribe if timer Id is defined
    this.timer.unsubscribe(this.abortTimer);
    this.abortTimer = undefined;
    } else {
      // Subscribe if timer Id is undefined
      this.abortTimer = this.timer.subscribe('idleTimer', e => this.listenCallback());
    }
  }


/**
 * The timer-methods update the counters accordingly to realtime seconds, and aborts survey if time has passed over threshold
 */
 listenCallback() {
   this.abortCounter++;
   if (this.abortCounter >= 60) {
     this.exitSurvey();
   } else if (this.done && this.abortCounter >= 5) {
     this.exitSurvey();
   }
  }

/**
 * This method resets the idle-timers
 * @return {[type]} [description]
 */
resetTimer() {
  this.abortCounter = 0;
}

/**
 * This method finishes the survey if the user clicks the END button
 */
  endSurvey() {
    // If it is the last page in the survey, it should end it.
    console.log('trying to end survey');
    if (!(this.survey.isPost || this.survey.postKey !== undefined) || this.postDone === true) {
      this.transition = true;
      this.postSurvey();
      this.response.questionlist = [];
      this.lastQuestionAnswered = 'inactive';
      this.animLoop = false;
      this.done = true;
      this.resetTimer();
      return;
    }
    // Else it should navigate to the nickname component
    this.nicknamePage = true;

  }

/**
 * This method quits the survey and routes it to the choose-survey component
 */
  quitSurvey() {
    const dialogRef = this.dialog.open(QuitsurveyPromptComponent);
  }

/**
 * This method posts the survey to the database
 */
  private postSurvey() {
    const responseClone = <Response>JSON.parse(JSON.stringify(this.response));
    if (this.survey.isPost || (this.survey.postKey && this.survey.postKey.length > 0)) {
      delete responseClone.nickname;
    }
    this.surveyService.postSurveyResponse(responseClone).subscribe((proper: boolean) => {
      this.properSurvey = true;
    });
  }

  /**
  * This method changes the language from eng to no
  * The method should not be visible if there is no alternative languages in the survey
  */
  private switchtono() {
    this.Twolanguage = true;
    // Animation change
    this.flagActiveEnglish = 'inactive';
    this.flagActiveNorwegian = 'active';
  }
    /**
    * This method changes the language from no to eng
    * The method should not be visible if there is no alternative languages in the survey
    */
  private switchtoen() {
    this.Twolanguage = !true;
    // Animation change
    this.flagActiveEnglish = 'active';
    this.flagActiveNorwegian = 'inactive';
  }

  animationEnd() {
    if (this.lastQuestionAnswered === 'inactive' && this.animLoop) {
      this.lastQuestionAnswered = 'active';
    } else if (this.lastQuestionAnswered === 'active' && this.animLoop) {
      this.lastQuestionAnswered = 'inactive';
    }
  }

  playCycle() {
    if (this.playButtonActive === 'inactive') {
      this.playButtonActive = 'active';
    } else if (this.playButtonActive === 'active') {
      this.playButtonActive = 'inactive';
    }
  }

  hideModal() {
    this.showmodal = false;
  }

  showModal() {
    this.showmodal = true;
  }
}
