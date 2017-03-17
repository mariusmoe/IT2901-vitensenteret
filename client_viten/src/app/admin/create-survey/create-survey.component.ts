import { Component, OnInit, OnDestroy, Inject, Input, animate, state, style, transition, trigger, keyframes } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { Survey, QuestionObject } from '../../_models/survey';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { TranslateService } from '../../_services/translate.service';


@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss'],
  animations: [trigger('slideInOut', [
    state('void', style({transform: 'translateX(0)' })),
    transition(':enter', [
      animate(300, keyframes([
        style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
        style({opacity: 1, transform: 'translateX(15px)',  offset: 0.3}),
        style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
      ]))
    ]),
    transition(':leave', [
      style({ transform: 'scaleY(0)', 'min-width': '0', 'max-height': '0' }),
      animate('0.1s ease-in-out', style({ 'max-width': '0' }))
    ])
  ])]
})
export class CreateSurveyComponent implements OnInit, OnDestroy {
  // COMPONENT VARIABLES
  submitLoading = false;
  startupLoading = true;
  englishEnabled = false;
  canPostSurvey = false;
  isPrePost = false;
  preSurvey: Survey;

  // SURVEY VARIABLES
  survey: Survey;
  maxQuestionLength = 50; // TODO: arbitrary chosen! discuss!
  isPatch = false;
  allowedModes = ['binary', 'star', 'single', 'multi', 'smiley', 'text'];
  allowedModesVerbose = {
   'binary': 'Yes/No',
   'star': '5 Stars',
   'multi': 'Multiple Choice',
   'smiley': 'Smiley',
   'text': 'Free Text'
 };

  // FORMATTING VARIABLES
  stringPattern = /\S/;


  constructor(private dialog: MdDialog, private surveyService: SurveyService,
    private router: Router, private route: ActivatedRoute,
    private dragulaService: DragulaService, private translate: TranslateService) {
      dragulaService.setOptions('questionsBag', {
        revertOnSpill: true,
        direction: 'horizontal',
        moves: function(el, container, handle) { return handle.classList.contains('dragHandle'); }
      });
  }

  ngOnInit() {
    // If we have a router parameter, we should attempt to use that first.
    // console.log(this.route.snapshot.url[0].path)
    const param = this.route.snapshot.params['surveyId'];
    // Safe checking of url if last part is prepost
    const url = this.route.snapshot.url;
    let prepost = false;
    if (typeof url[2] !== 'undefined') {
      prepost = true;
    }
    if (param) {
      const sub = this.surveyService.getSurvey(param).subscribe(result => {

        // If this survey is intended as a post to another; do the following
        if (prepost) {
          this.isPrePost = true;
          console.log('PREPOST!');
          this.preSurvey = result.survey;
          // Set defaults seeing we had no router parameter
          // Is there a more sexy way to do this?
          this.survey = {
            'name': '',
            'postKey': '',
            'comment': '',
            'date': new Date().toISOString(),
            'activationDate': new Date().toISOString(),
            'active': true,
            'questionlist': [],
            'endMessage': {
              'no': '',
              'en': '', // do not remove. see submitSurvey for handling of english properties.
            }
          };
          this.startupLoading = false;
        } else {
        // FIXME why do linter go ham here?
        this.survey = result.survey;
        this.isPatch = true;

        // somewhat hacky way to determine english state.
        // if (this.survey.questionlist[0].lang.en
        //   && this.survey.questionlist[0].lang.en.txt
        //   && this.survey.questionlist[0].lang.en.txt.length > 0) {
        //   this.englishEnabled = true;
        // }

        // Do not remove the following lines!
        this.setPushReadyStatus();
        this.startupLoading = false;

      }
      // unsubscribe! the service (and the subscription) is still there
      // after this component gets destroyed. We have no futher need of it here,
      // so might as well unsub now.
      sub.unsubscribe();
      },
      error => {
        // this.route.snapshot is the route for the SUBDOMAIN of /admin
        // this.route.parent gives us the PARENT domain (ranging from '' to the parent
        // of this route). We want to return to the parent url in a programatic
        // fashion as to avoid issues should the routes be altered.
        this.router.navigate([this.route.parent.snapshot.url.join('/')]);
      });
      // IMPORTANT notice this return!
      return;
    }
    // Set defaults seeing we had no router parameter
    this.survey = {
      'name': '',
      'postKey': '',
      'comment': '',
      'date': new Date().toISOString(),
      'activationDate': new Date().toISOString(),
      'active': true,
      'questionlist': [],
      'endMessage': {
        'no': '',
        'en': '', // do not remove. see submitSurvey for handling of english properties.
      }
    };
    this.startupLoading = false;
  }

  ngOnDestroy() {
      this.dragulaService.destroy('questionsBag');
  }

    /**
     * setSaveReadyStatus()
     *
     * Checks every part of the survey and returns true if the survey is valid
     */
    setPushReadyStatus() {
      // note: comment is NOT required, and is thusly not listed here.
      let status = this.fieldValidate(this.survey.name)     // name
        && this.survey.questionlist.length > 0              // at least one question
        && this.fieldValidate(this.survey.endMessage.no);   // message no
      if (this.englishEnabled) {                            // message en
        status = status && this.fieldValidate(this.survey.endMessage.en);
      }
      console.log(this.survey.questionlist);
      // check each question
      for (const questionObject of this.survey.questionlist) {
        // the actual question
        status = status && this.fieldValidate(questionObject.lang.no.txt);
        if (this.englishEnabled) {
          status = status && this.fieldValidate(questionObject.lang.en.txt);
        }
        // and the options, if multi is selected
        if (questionObject.mode === 'multi') {
          // ..if more than 2 options are added
          if (questionObject.lang.no.options.length < 2) {
            status = false;
            break;
          }
          // and if each option is valid
          for (const o of questionObject.lang.no.options) {
            status = (status && o.length > 0 && this.fieldValidate(o));
          }
          if (this.englishEnabled) {
            for (const o of questionObject.lang.en.options) {
              status = (status && o.length > 0 && this.fieldValidate(o));
            }
          }
        }
      }
      // and finally set the status
      this.canPostSurvey = status;
    }

    /**
     * notWhitespace(s: string)
     *
     * @param {string} s a string to check
     * returns true if the input string is not just whitespace
     */
    fieldValidate(s: string) {
      return s && s.length > 0 && (/\S/.test(s));
    }



  /**
   * submitSurvey()
   *
   * Sends a http POST or a http PATCH request with the survey to the server.
   */
  submitSurvey() {
    // if (!this.canPostSurvey) { return; }
    const clone: Survey = JSON.parse(JSON.stringify(this.survey));
    this.submitLoading = true;

    // remove options-properties of non-multi questions
    // TODO make this work for 'single'
    for (const qo of clone.questionlist) {
      if (qo.mode !== 'multi') {
        delete qo.lang.no.options;
        delete qo.lang.en.options;
      }
    }
    // remove english fields from our submitted survey if it is not enabled
    if (!this.englishEnabled) {
      delete clone.endMessage.en;
      for (const qo of clone.questionlist) {
        delete qo.lang.en;
      }
    }

    // console.log(clone);
    // Execute the following when we've gotten a response from the server
    const err = (error) => {
      this.submitLoading = false;
      const config: MdDialogConfig = {
        data: {
          status: error.status,
          message: error.message, // TODO: FIXME! no message for unauthorized!
        }
      };
      // this dialog is purely to inform the user.
      this.dialog.open(SurveyPublishDialog, config);
    };
    const success = (result) => {
      this.submitLoading = false;

      // this.route.snapshot is the route for the SUBDOMAIN of /admin
      // this.route.parent gives us the PARENT domain (ranging from '' to the parent
      // of this route). We want to return to the parent url in a programatic
      // fashion as to avoid issues should the route name be altered.
      if (this.isPatch) {
        // We append /:surveyId at the end to bring the user back to the survey he or she just edited.
        this.router.navigate([this.route.parent.snapshot.url.join('/') + '/' + this.survey._id]);
        return;
      }
      this.router.navigate([this.route.parent.snapshot.url.join('/')]);
    };
    if (this.isPrePost) {
      // TODO PATCH pre-survey and post post survey FIXME
      // Alternatively create a route that takes pre-survey._id and do all
      // the work.
      this.surveyService.postSurvey(clone).subscribe(result => {
        // success(result)
        this.preSurvey.postKey = result._id;
        const preSurvey: Survey = JSON.parse(JSON.stringify(this.preSurvey));
        this.surveyService.patchSurvey(preSurvey._id, preSurvey).subscribe(result2 => success(result2), error => err(error));
      }, error => err(error));
      // this.preSurvey = original + preKey = result.survey._id // or something
    } else {
      // Send request to the server; either PATCH or POST.
      if (this.isPatch) {
        // console.log("PATCHING!")
        this.surveyService.patchSurvey(clone._id, clone).subscribe(result => success(result), error => err(error));
      } else {
        // console.log("POSTING!")
        this.surveyService.postSurvey(clone).subscribe(result => success(result), error => err(error));
      }
    }
  }


  /**
   * addQuestion()
   *
   * Adds a question to the survey form
   */
  addQuestion() {
    const qo: QuestionObject = {
      mode: this.allowedModes[4], // default to smiley
      required: true, // default to true
      lang: {
        // options are added here. They are removed again for non-multi
        // questions when you submit the survey.
        no: { txt: '', options: [] },
        en: { txt: '', options: [] },
      }
    };
    this.survey.questionlist.push(qo);
    // Do not remove the following line!
    this.setPushReadyStatus();
  }

  /**
   * removeQuestion(index: number)
   * @param {number} index the index of the question to remove
   * Removes the n'th question, where n is specified by the index param.
   */
  removeQuestion(index: number) {
    this.survey.questionlist.splice(index, 1);
    // Do not remove the following line!
    this.setPushReadyStatus();
  }


  /**
   * setAlternatives(qo: QuestionObject)
   *
   * @param {QuestionObject} qo the questionObject on which to add alternatives
   * Launches the SurveyAlternatives Dialog (TO BE IMPLEMENTED BELOW)
   */
  setAlternatives(qo: QuestionObject) {
    const config: MdDialogConfig = {
      data: {
        questionObject: qo,
        englishEnabled: this.englishEnabled,
      }
    };
    const dialogRef = this.dialog.open(SurveyAlternativesDialog, config);
    const sub = dialogRef.afterClosed().subscribe( () => {
      const output = dialogRef.componentInstance.outputQuestionObject;
      // output doesn't exist if the user hits cancel or otherwise closes the
      // dialog window
      if (output != null && output !== undefined) {
        qo.lang.no.options = output.lang.no.options;
        qo.lang.en.options = output.lang.en.options;
        // Do not remove the following line!
        this.setPushReadyStatus();
      }
      sub.unsubscribe();
    });
  }
}



@Component({
  selector: 'alternatives-dialog',
  styleUrls: ['./create-survey.component.scss'],
  template: `
  <h2 md-dialog-title>{{ 'Set Alternatives' | translate }}</h2>
  <md-dialog-content>
    <span>{{ 'At least two alternatives must be set, with a maximum of 6.' | translate }}</span>
    <div *ngFor="let i of numAlternatives;">
      <md-input-container>
        <input mdInput type="text" placeholder="{{ 'Alternative' | translate }} {{(i+1)}} ({{ 'Norwegian' | translate }})"
        [(ngModel)]="qoEditObj.lang.no.options[i]" required (change)='setSaveReadyStatus()'>
        <md-hint color="warn" *ngIf="!fieldValidate(qoEditObj.lang.no.options[i])">{{ 'This field is required.' | translate }}</md-hint>
      </md-input-container>
      <md-input-container *ngIf="data.englishEnabled">
        <input mdInput type="text" placeholder="{{ 'Alternative' | translate }} {{(i+1)}} ({{ 'English' | translate }})"
        [(ngModel)]="qoEditObj.lang.en.options[i]" required (change)='setSaveReadyStatus()'>
        <md-hint color="warn" *ngIf="!fieldValidate(qoEditObj.lang.en.options[i])">{{ 'This field is required.' | translate }}</md-hint>
      </md-input-container>
      <button md-icon-button color="warn" [disabled]="i < 2" class="alignRight"
      (click)="removeOption(qoEditObj, i)"><md-icon>remove_circle</md-icon></button>
    </div>
    <button md-raised-button color="accent" [disabled]="qoEditObj.lang.no.options.length==6"
    (click)="addOption(qoEditObj)"><md-icon>add_box</md-icon> {{ 'Add Option' | translate }}</button>
  </md-dialog-content>
  <md-dialog-actions align="center">
  </md-dialog-actions>
  <md-dialog-actions align="center">
    <button md-raised-button color="primary" [disabled]="!canSave"
    [md-tooltip]="canSave ? '' : 'All required fields must be filled in!'"
    tooltip-position="above"
    (click)="save()">{{ 'Save' | translate }}</button>
    <button md-raised-button color="warn" (click)="cancel()">{{ 'Cancel' | translate }}</button>
  </md-dialog-actions>
  `
})
export class SurveyAlternativesDialog {
  qoEditObj: QuestionObject;
  outputQuestionObject: QuestionObject;
  alternativeDefaults: boolean[];
  activeAlternatives: Object[];
  canSave = false;

  // for complicated reasons, this is required.
  numAlternatives: number[];

  constructor(public dialogRef: MdDialogRef<SurveyAlternativesDialog>, @Inject(MD_DIALOG_DATA) public data: any) {
    // Create a copy of our questionObject
    this.qoEditObj = JSON.parse(JSON.stringify(this.data.questionObject));
    // if there are less than 2 options, fill them in
    while (this.qoEditObj.lang.no.options.length < 2) {
      this.addOption(this.qoEditObj);
    }
    // this is required! Do NOT remove!
    this.numAlternatives = Array(this.qoEditObj.lang.no.options.length).fill(0).map((x, i) => i);
    this.setSaveReadyStatus();
  }


  /**
   * cancel()
   *
   * Hides the dialog window. No change is stored.
   */
  cancel() {
    this.dialogRef.close();
  }
  /**
   * save()
   *
   * Hides the dialog window, and stores any changes to alternatives
   */
  save() {
    this.outputQuestionObject = this.qoEditObj;
    this.dialogRef.close();
  }

  /**
   * setSaveReadyStatus()
   *
   * Checks the options / alternatives and sets the canSave flag accordingly.
   */
  setSaveReadyStatus() {
    let status = true;
    for (const o of this.qoEditObj.lang.no.options) {
      status = (status && o.length > 0 && this.fieldValidate(o));
    }
    if (this.data.englishEnabled) {
      for (const o of this.qoEditObj.lang.en.options) {
        status = (status && o.length > 0 && this.fieldValidate(o));
      }
    }
    this.canSave = status;
  }

  /**
   * notWhitespace(s: string)
   *
   * @param {string} s a string to check
   * returns true if the input string is not just whitespace
   */
  fieldValidate(s: string) {
    return s && s.length > 0 && (/\S/.test(s));
  }


  /**
   * addOption(qo: QuestionObject)
   *
   * @param {QuestionObject} qo the questionObject on which to add an option
   * Adds an option to the SurveyAlternatives Dialog (TO BE IMPLEMENTED BELOW)
   * and sets defaults in the survey object
   */
  addOption(qo: QuestionObject) {
    if (!qo.lang.no.options) {
      qo.lang.no.options = [];
      qo.lang.en.options = [];
    }
    qo.lang.no.options.push('');
    qo.lang.en.options.push('');
    // this is required! Do NOT remove!
    this.numAlternatives = Array(this.qoEditObj.lang.no.options.length).fill(0).map((x, i) => i);
    this.setSaveReadyStatus();
  }

  /**
   * removeOption(qo: QuestionObject, index: number)
   *
   * @param {QuestionObject} qo the questionObject on which to remove an option
   * @param {number} index the index of the option to remove
   * Removes an option to the SurveyAlternatives Dialog (TO BE IMPLEMENTED BELOW)
   * and removes it from the survey object
   */
  removeOption(qo: QuestionObject, index: number) {
    qo.lang.no.options.splice(index, 1);
    qo.lang.en.options.splice(index, 1);
    if (qo.lang.no.options.length === 0) {
      delete qo.lang.no.options;
      delete qo.lang.en.options;
    }
    // this is required! Do NOT remove!
    this.numAlternatives = Array(this.qoEditObj.lang.no.options.length).fill(0).map((x, i) => i);
    this.setSaveReadyStatus();
  }
}







@Component({
  selector: 'post-survey-dialog',
  styleUrls: ['./create-survey.component.scss'],
  template: `
  <h2 md-dialog-title class="alignCenter">{{ 'Post results' | translate }}</h2>
  <md-dialog-content align="center">
    <p>{{ 'Could not post your survey. Error:' | translate }}</p>
    <span class="error">
      <span>{{data.status}}</span>
      <span>: </span>
      <span>{{data.message}}</span>
    </span>
    <p>{{ 'The system cannot proceed until the issue has been resolved.' | translate }}</p>
  </md-dialog-content>
  <md-dialog-actions align="center">
    <button md-raised-button color="primary" (click)="okay()">{{ 'Okay' | translate }}</button>
  </md-dialog-actions>
  `
})
export class SurveyPublishDialog {
  survey: Survey;

  constructor(public dialogRef: MdDialogRef<SurveyPublishDialog>, @Inject(MD_DIALOG_DATA) public data: any) {
  }


  /**
   * okay()
   *
   * Hides the dialog window.
   */
  okay() {
    this.dialogRef.close();
  }

}
