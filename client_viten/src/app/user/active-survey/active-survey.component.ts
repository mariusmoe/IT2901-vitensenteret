import { Component, OnInit, OnDestroy, Input, Output, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { SurveyService } from '../../_services/survey.service';
import { Response } from '../../_models/response';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Survey, QuestionObject } from '../../_models/survey';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { SimpleTimer } from 'ng2-simple-timer';
import { QuitsurveyPromptComponent } from './quitsurvey-prompt.component';
import { TranslateService } from '../../_services/translate.service';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { MdSnackBar } from '@angular/material';


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

export class ActiveSurveyComponent implements OnInit, OnDestroy {
  @Input() alternative: number; // The answer- \input recieved from child components.
  properSurvey = false; // If the survey is valid, posting it to the database is possible.
  started = false; // If a survey is started, this is true.
  survey: Survey; // The survey-object which is used to access information about the survey
  response: Response; // The reposne-object that is used to control all user input
  page = 0; // The current page the user is on
  totalPages = 0; // The total amount of pages in the survey
  transition = false; // If true, animation between pages are triggerd
  englishEnabled: boolean;

  noreqans = false; // If true, there is no answer for required question, and right arrow is disabled
  showmodal = false; // controls the visibility state of the modal window

  done = false; // if true it takes you to the endMessage-screen
  postDone; /* postDone is a boolean that tells if the pre-post has been handled.
               Is only initialized if survey is pre/post. Set to true in html.*/
  nicknamePage; // Only initialized if pre-post. Is true when the user is on the nickname page.
  nicknamesForSurvey: string[];

  abortTimer: string; // The ID for the timer
  abortCounter = 0; // The actual timer, updates in the listenCallback() function

  isNicknameTaken = false;
  postNicknameMatch = false;
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
      public snackBar: MdSnackBar,
    public translateService: TranslateService,
    private title: Title) {
      title.setTitle(translateService.instant('Center - Survey', 'Center'));
  }

  /**
   * ngOnInit
   * Take the URL and get the survey from url-Param
   */
  ngOnInit() {
    // Sets default language to Norwegian at startup
    this.nicknamesForSurvey = [];
    this.postNicknameMatch = false;
    this.switchtono();
    if (this.route.snapshot.params['surveyId']) {
      const sub = this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {
        sub.unsubscribe();

        if (!result) {
          // TODO: Redirect to base create survey ?
          return;
        }
        this.survey = result.survey;

        this.response = <Response> {
            nickname: undefined,
            questionlist: [],
            surveyId: this.survey._id,
        };
        this.totalPages = this.survey.questionlist.length;

        // Sets the language to no as standard when it is created
        // this.language = this.survey.questionlist[this.page].lang.no.txt;
        this.translateService.use('no');
        // somewhat hacky way to determine english state.
        if (this.survey.questionlist[0].lang.en
          && this.survey.questionlist[0].lang.en.txt
          && this.survey.questionlist[0].lang.en.txt.length > 0) {
          this.englishEnabled = true;
        }
        this.timer.newTimer('refreshNicknames', 30);
        this.timer.subscribe('refreshNicknames', e => {
          const sub2 = this.surveyService.getNicknames(this.survey._id)
            .subscribe( result2 => {
                this.nicknamesForSurvey = [];
                result2.forEach((x) => { this.nicknamesForSurvey.push(x.nickname); });
                sub2.unsubscribe();
              },
              error => {
                console.error('error when get nicknames');
              }
            );
        });

        if (this.survey && this.survey._id) {
          this.properSurvey = true;
        } else {
          console.log(this.survey)
          console.error('Survey is not active or something else is wrong!');
        }
      });
      return;
    }
  }

  ngOnDestroy() {
    this.timer.unsubscribe('refreshNicknames');
    this.timer.delTimer('refreshNicknames');
  }
  /**
   * This method starts the survey as well as the inactivity timer
   */
  startSurvey() {
    // Checks if the survey is inactive
    if (this.route.snapshot.params['surveyId']) {
      const sub = this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {

        sub.unsubscribe();

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
          return;
        }
        this.survey = result.survey;
        this.totalPages = this.survey.questionlist.length;
        if (this.survey && this.survey._id) {
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
  this.response.questionlist[this.page] = alternative;
  if (this.page + 1 === this.totalPages && this.response.questionlist[this.page] == null && alternative != null) {
    this.animLoop = true;
    this.lastQuestionAnswered = 'active';
  }

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
   /**
    * Updates the nickname in Response
    * @param  {[type]} nickname [description]
    * @return {[type]}          [description]
    */
   updateNick(nickname) {
     this.response.nickname = nickname;
     if (this.survey.isPost) {
       if (this.nicknamesForSurvey.some(c => c.toLowerCase( ) === (nickname.toLowerCase()))) {
         this.postNicknameMatch = true;
       } else {
         this.postNicknameMatch = false;
       }
     } else {
       if (this.nicknamesForSurvey.some(c => c.toLowerCase( ) === (nickname.toLowerCase()))) {
         this.isNicknameTaken = true;
       } else {
         this.isNicknameTaken = false;
       }
     }
   }

/**
 * This method handles the transition to the previous questions in the survey
 * @return {undefined} Returns nothing just to prevent overflow
 */
  private previousQ() {
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
    // Handles an empty answer
    if (typeof this.response.questionlist[this.page] === 'undefined') {
      this.response.questionlist[this.page] = -1;
    }
    // If current page is the last with questions, the next page should be the endSurvey page
    const pageCopy = this.page;
    if (pageCopy + 1 >= this.totalPages) {
      if (this.survey.postKey !== undefined || this.survey.isPost) {
        this.nicknamePage = true;
      }
      // If it is the last page in the survey, it should end it.
      if (!(this.survey.isPost || this.survey.postKey !== undefined) || this.postDone === true) {

        const responseClone = <Response>JSON.parse(JSON.stringify(this.response));
        this.surveyService.postSurveyResponse(responseClone).subscribe((proper: boolean) => {
          if (proper) {
            this.transition = true;
            this.properSurvey = true;
            this.response.questionlist = [];
            this.lastQuestionAnswered = 'inactive';
            this.animLoop = false;
            this.done = true;
            this.resetTimer();
          }
        },
        error => {
            console.error('Error when posting survey');
            this.nicknamePage = true;
            return;
        });
        // this.response.questionlist = [];
        // this.lastQuestionAnswered = 'inactive';
        // this.animLoop = false;
        // this.done = true;
        this.resetTimer();
        return;
      } else {
        // Else it should navigate to the nickname component
        this.nicknamePage = true;
      }

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
   if (!this.survey.active) {
     return;
   }
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
 * Opens a snackbar with the given message and action message
 * @param  {string} message The message that is to be displayed
 * @param  {string} action  the action message that is to be displayed
 */
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 5000,
  });
}

/**
 * This method finishes the survey if the user clicks the END button
 */
  endSurvey() {
    // If it is the last page in the survey, it should end it.
    if (!(this.survey.isPost || this.survey.postKey !== undefined) || this.postDone === true) {

      const responseClone = <Response>JSON.parse(JSON.stringify(this.response));
      // console.log(responseClone);
      this.surveyService.postSurveyResponse(responseClone).subscribe((proper: boolean) => {
        if (proper) {
          const indexOfNickname = this.nicknamesForSurvey.indexOf(this.response.nickname);
          if (indexOfNickname >= 0) {
            this.nicknamesForSurvey.splice(indexOfNickname, 1);
          }
          this.transition = true;
          this.properSurvey = true;
          this.response.questionlist = [];
          this.lastQuestionAnswered = 'inactive';
          this.animLoop = false;
          this.done = true;
          this.resetTimer();
        }
      },
      error => {
          console.error(error._body);
          if (error._body){
            const error_message = JSON.parse(error._body)
              this.openSnackBar(error_message['message'], 'FAILURE ');
          }
          this.postDone = false;
          this.isNicknameTaken = true;
      });
      // this.response.questionlist = [];
      // this.lastQuestionAnswered = 'inactive';
      // this.animLoop = false;
      // this.done = true;
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
    const config: MdDialogConfig = {
      data: {
        survey: this.survey,
      }
    };
    const dialogRef = this.dialog.open(QuitsurveyPromptComponent, config);
  }


  /**
  * This method changes the language from eng to no
  * The method should not be visible if there is no alternative languages in the survey
  */
  private switchtono() {
    this.translateService.use('no');
    // Animation change
    this.flagActiveEnglish = 'inactive';
    this.flagActiveNorwegian = 'active';
  }
    /**
    * This method changes the language from no to eng
    * The method should not be visible if there is no alternative languages in the survey
    */
  private switchtoen() {
    this.translateService.use('en');
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
}
