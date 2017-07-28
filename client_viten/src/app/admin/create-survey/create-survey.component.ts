import { Component, OnInit, OnDestroy, Inject, Input } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { SurveyService } from '../../_services/survey.service';
import { Survey, QuestionObject } from '../../_models/survey';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { TranslateService } from '../../_services/translate.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

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
      animate(100, keyframes([
        style({transform: 'scaleY(0)', 'min-width': '0', 'max-height': '0', 'max-width': '300px', offset: 0}),
        style({transform: 'scaleY(0)', 'min-width': '0', 'max-height': '0', 'max-width': '0',   offset: 1.0})
      ]))
    ]),
  ])]
})


// transition(':leave', [
//  style({ transform: 'scaleY(0)', 'min-width': '0', 'max-height': '0' }),
//  animate('0.1s ease-in-out', style({ 'max-width': '0%' }))
// ])

export class CreateSurveyComponent implements OnInit, OnDestroy {
  // COMPONENT VARIABLES
  submitLoading = false;
  startupLoading = true;
  englishEnabled = false;
  canPostSurvey = false;
  isPost = false;

  // SURVEY VARIABLES
  survey: Survey;
  preSurvey: Survey;
  maxQuestionLength = 150; // TODO: arbitrary chosen! discuss!
  isPatch = false;
  allowedModes = ['binary', 'star', 'single', 'multi', 'smiley', 'text'];


  public  dialogRef: MdDialogRef<WarnDeletionDialog>;

  // FORMATTING VARIABLES
  stringPattern = /\S/;
  imageLinkPattern = /(https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;


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
    const param = this.route.snapshot.params['surveyId'];

    // Safe checking of url if last part is prepost
    if (typeof this.route.snapshot.url[2] !== 'undefined') {
      this.isPost = true;
    }

    if (!param) {
      // Set defaults seeing we had no router parameter
      // Though if we have a session in the works, load that!
      const sessionSurveyString = sessionStorage.getItem('surveyInCreation');
      const sessionSurveyObject = JSON.parse(sessionSurveyString);
      // We are only to use this system IF we are creating a fresh survey.
      // Param above is nonexisting, i.e. we're creating a FRESH survey,
      // and if the sessionStorage contains a survey with NO id, then we're good
      // to go.
      if (sessionSurveyObject && (<Survey>sessionSurveyObject)._id === undefined) {
        this.survey = sessionSurveyObject;
        // though we should update some bits of information;
      } else {
        // Do not remove the following lines!
        this.survey = {
          'name': '',
          'comment': '',
          'active': true,
          'isPost': false,
          'questionlist': [],
          'endMessage': {
            'no': '',
            'en': '', // do not remove. see submitSurvey for handling of english properties.
          }
        };
      }
      this.onSurveyChange();
      this.startupLoading = false;
      return;
    }

    // Fetch data if editing a survey or adding a post to a survey
    const sub = this.surveyService.getSurvey(param).subscribe(
      result => {
        if (this.isPost) {
          this.setupInitialSurveyStateFrom(result.survey);
          this.survey.name = 'POST: ' + this.survey.name;
          this.survey.isPost = true;

          this.preSurvey = result.survey;
        } else {
          this.survey = result.survey;
          this.isPatch = true;
        }

        // somewhat hacky way to determine english state.
        if (this.survey.questionlist[0].lang.en
          && this.survey.questionlist[0].lang.en.txt
          && this.survey.questionlist[0].lang.en.txt.length > 0) {
          this.englishEnabled = true;
        }

        // Do not remove the following lines!
        this.onSurveyChange();
        this.startupLoading = false;
        sub.unsubscribe();
      },
      error => {
        sub.unsubscribe();
        // this.route.snapshot is the route for the SUBDOMAIN of /admin
        // this.route.parent gives us the PARENT domain (ranging from '' to the parent
        // of this route). We want to return to the parent url in a programatic
        // fashion as to avoid issues should the routes be altered.
        this.router.navigate([this.route.parent.snapshot.url.join('/')]);
      });
  }

  ngOnDestroy() {
      this.dragulaService.destroy('questionsBag');
  }

  /**
   * setupInitialSurveyStateFrom(survey: Survey)
   * Initiates state
   * @param  {Survey} survey the survey reference to copy
   */
  private setupInitialSurveyStateFrom(survey: Survey) {
    this.survey = JSON.parse(JSON.stringify(survey)); // Initiate the survey with an exact duplicate.
    delete this.survey._id;
  }

  /**
   * onSurveyChange()
   *
   * Checks every part of the survey and returns true if the survey is valid
   * Also updates the session storage
   */
  onSurveyChange() {
    // Update the session storage
    if (!this.isPost) {
      sessionStorage.setItem('surveyInCreation', JSON.stringify(this.survey));
    }
    // note: comment is NOT required, and is thusly not listed here.
    let status = this.fieldValidate(this.survey.name)     // name
      && this.survey.questionlist.length > 0              // at least one question
      && this.fieldValidate(this.survey.endMessage.no);   // message no
    if (this.englishEnabled) {                            // message en
      status = status && this.fieldValidate(this.survey.endMessage.en);
    }
    // check each question
    for (const questionObject of this.survey.questionlist) {
      // the actual question
      status = status && this.fieldValidate(questionObject.lang.no.txt);
      if (this.englishEnabled) {
        status = status && this.fieldValidate(questionObject.lang.en.txt);
      }
      // and the options, if multi or single is selected
      if (questionObject.mode === 'multi' || questionObject.mode === 'single') {
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
      if (!this.imageLinkValidate(questionObject.imageLink)) {
        status = false;
      }
    }
    // and finally set the status
    this.canPostSurvey = status;
  }

  /**
   * fieldValidate(s: string)
   *
   * @param {string} s a string to check
   * returns true if the input string is not just whitespace
   */
  fieldValidate(s: string) {
    return s && s.length > 0 && (/\S/.test(s));
  }


  /**
   * imageLinkValidate(s: string)
   *
   * @param {string} s a string to check
   * returns true if the input string matches an image url
   */
  imageLinkValidate(s: string) {
    return s === undefined || (s && s.length > 0 && this.imageLinkPattern.test(s) || s.length === 0);
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
    // also remove imageLink if it is not valid (left blank)
    for (const qo of clone.questionlist) {
      if (qo.mode !== 'multi' && qo.mode !== 'single') {
        if (qo.lang.no) {
          delete qo.lang.no.options;
        }
        if (qo.lang.en) {
          delete qo.lang.en.options;
        }
      }

      if ((typeof qo.imageLink === 'string' ) && qo.imageLink.length === 0) {
        delete qo.imageLink;
      }
    }

    if (!this.englishEnabled) {
      // remove english fields from our submitted survey if it is not enabled
      delete clone.endMessage.en;
      for (const qo of clone.questionlist) {
        delete qo.lang.en;
      }
    }

    // Execute the following when we've gotten a response from the server
    const err = (error) => {
      this.submitLoading = false;
      const body = error.json();
      const config: MdDialogConfig = {
        data: {
          status: body.status,
          message: body.message,
        }
      };
      // this dialog is purely to inform the user.
      this.dialog.open(SurveyPublishDialog, config);
    };
    const success = (result) => {
      this.submitLoading = false;

      // given success status for creation of survey, we now remove what we have in the session storage
      sessionStorage.removeItem('surveyInCreation');

      // this.route.snapshot is the route for the SUBDOMAIN of /admin
      // this.route.parent gives us the PARENT domain (ranging from '' to the parent
      // of this route). We want to return to the parent url in a programatic
      // fashion as to avoid issues should the route name be altered.
      if (this.preSurvey && this.preSurvey._id) {
        this.router.navigate([this.route.parent.snapshot.url.join('/'), this.preSurvey._id]);
      } else if (this.survey._id && (!this.isPost || !this.survey.isPost)) {
        this.router.navigate([this.route.parent.snapshot.url.join('/'), this.survey._id]);
      } else {
        this.router.navigate([this.route.parent.snapshot.url.join('/')]);
      }
    };

    // Check prepost conditions first
    if (this.isPost) {
      this.surveyService.postSurvey(clone).subscribe(result => {
        this.preSurvey.postKey = result._id;
        this.surveyService.patchSurvey(this.preSurvey._id, this.preSurvey).subscribe(result2 => success(result2), error => err(error));
      }, error => err(error));
      // this.preSurvey = original + preKey = result.survey._id // or something


    } else {
      // Send request to the server; either PATCH or POST.
      if (this.isPatch) {
        this.surveyService.patchSurvey(clone._id, clone).subscribe(result => success(result), error => err(error));
      } else {
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
        // options are added here. They are removed again for non-multi & non-single
        // questions when you submit the survey.
        no: { txt: '', options: [] },
        en: { txt: '', options: [] },
      }
    };
    this.survey.questionlist.push(qo);
    // Do not remove the following line!
    this.onSurveyChange();
  }

  /**
   * removeQuestion(index: number)
   * @param {number} index the index of the question to remove
   * Removes the n'th question, where n is specified by the index param.
   */
  removeQuestion(index: number) {
    this.survey.questionlist.splice(index, 1);
    // Do not remove the following line!
    this.onSurveyChange();
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
      },
      disableClose: true,
    };
    const dialogRef = this.dialog.open(SurveyAlternativesDialog, config);
    const sub = dialogRef.afterClosed().subscribe( () => {
      const output = dialogRef.componentInstance.outputQuestionObject;
      // output doesn't exist if the user hits cancel or otherwise closes the
      // dialog window
      if (output != null && output !== undefined) {
        qo.lang.no.options = output.lang.no.options;
        if (qo.lang.en && qo.lang.en.options && output.lang.en && output.lang.en.options) {
          qo.lang.en.options = output.lang.en.options;
        }
        // Do not remove the following line!
        this.onSurveyChange();
      }
      sub.unsubscribe();
    });
  }



  /**
   * Opens a promt if the user realy want to save the changes
   */
  openDialog() {
    this.dialogRef = this.dialog.open(WarnDeletionDialog, {
      disableClose: false
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.submitSurvey();
      }
      this.dialogRef = null;
    });
  }

  saveChanges() {
    if (this.isPatch) {
      // Give a modal window that informs the user that all answers will be lost
      this.openDialog();
    } else {
      this.submitSurvey();
    }
  }
}



@Component({
  selector: 'alternatives-dialog',
  styleUrls: ['./create-survey.component.scss'],
  template: `
  <h1 md-dialog-title>{{ 'Set Alternatives' | translate }}</h1>
  <div md-dialog-content>
    <span>{{ 'At least two alternatives must be set, with a maximum of 6.' | translate }}</span>
    <div [dragula]="'alterativesBag'" [dragulaModel]="numAlternatives" class="alternativesBag">
      <div *ngFor="let i of numAlternatives; let in = index">
        <md-input-container>
          <input mdInput type="text" placeholder="{{ 'Alternative' | translate }} {{(in+1)}} ({{ 'Norwegian' | translate }})"
          [(ngModel)]="qoEditObj.lang.no.options[i]" required (input)='setSaveReadyStatus()'>
          <md-hint color="warn" *ngIf="!fieldValidate(qoEditObj.lang.no.options[i])
            || fieldCheckDup(qoEditObj.lang.no.options[i], qoEditObj.lang.no.options)"
            >{{ !fieldValidate(qoEditObj.lang.no.options[i]) ? ('This field is required.' | translate)
              : ('This field is a duplicate.' | translate) }}</md-hint>
        </md-input-container>
        <md-input-container *ngIf="data.englishEnabled">
          <input mdInput type="text" placeholder="{{ 'Alternative' | translate }} {{(in+1)}} ({{ 'English' | translate }})"
          [(ngModel)]="qoEditObj.lang.en.options[i]" required (input)='setSaveReadyStatus()'>
          <md-hint color="warn" *ngIf="!fieldValidate(qoEditObj.lang.en.options[i])
            || fieldCheckDup(qoEditObj.lang.en.options[i], qoEditObj.lang.en.options)"
            >{{ !fieldValidate(qoEditObj.lang.en.options[i]) ? ('This field is required.' | translate)
              : ('This field is a duplicate.' | translate) }}</md-hint>
        </md-input-container>
        <button md-icon-button color="warn" [disabled]="(in < 2)" class="alignRight"
        (click)="removeOption(qoEditObj, i)"><md-icon>remove_circle</md-icon></button>
      </div>
    </div>
    <button md-raised-button color="accent" [disabled]="qoEditObj.lang.no.options.length==6"
    (click)="addOption(qoEditObj)"><md-icon>add_box</md-icon> {{ 'Add Option' | translate }}</button>
  </div>
  <div md-dialog-actions align="center">
  </div>
  <div md-dialog-actions align="center">
    <button md-raised-button color="primary" [disabled]="!canSave"
    [md-tooltip]="canSave ? '' : 'All required fields must be filled in!'"
    tooltip-position="above"
    (click)="save()">{{ 'Save' | translate }}</button>
    <button md-raised-button color="warn" (click)="cancel()">{{ 'Cancel' | translate }}</button>
  </div>
  `
})
export class SurveyAlternativesDialog implements OnInit, OnDestroy {
  qoEditObj: QuestionObject;
  outputQuestionObject: QuestionObject;
  alternativeDefaults: boolean[];
  activeAlternatives: Object[];
  canSave = false;

  // for complicated reasons, this is required.
  numAlternatives: number[];

  constructor(public dialogRef: MdDialogRef<SurveyAlternativesDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    private dragulaService: DragulaService, private translate: TranslateService) {

    // Create a copy of our questionObject
    this.qoEditObj = JSON.parse(JSON.stringify(this.data.questionObject));
    // if there are less than 2 options, fill them in
    while (this.qoEditObj.lang.no.options.length < 2) {
      this.addOption(this.qoEditObj);
    }

    this.dragulaService.setOptions('alternativesBag', {
      revertOnSpill: true,
      direction: 'vertical',
      // moves: function(el, container, handle) { return handle.classList.contains('dragHandle'); }
    });

    // this is required! Do NOT remove!
    this.numAlternatives = Array(this.qoEditObj.lang.no.options.length).fill(0).map((x, i) => i);
    this.setSaveReadyStatus();
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.dragulaService.destroy('alternativesBag');
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
    // the following block deals with reordering of the questions
    const newOptionsNO = [], newOptionsEN = [];
    for (const i of this.numAlternatives) {
      newOptionsNO.push(this.qoEditObj.lang.no.options[i]);
      if (this.qoEditObj.lang.en && this.qoEditObj.lang.en.options) {
        newOptionsEN.push(this.qoEditObj.lang.en.options[i]);
      }
    }
    for (let i = 0; i < this.numAlternatives.length; i++) {
      this.qoEditObj.lang.no.options[i] = newOptionsNO[i];
      if (this.qoEditObj.lang.en && this.qoEditObj.lang.en.options) {
        this.qoEditObj.lang.en.options[i] = newOptionsEN[i];
      }
    }


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
      status = (status && this.fieldValidate(o) && !this.fieldCheckDup(o, this.qoEditObj.lang.no.options) );
    }
    if (this.data.englishEnabled) {
      for (const o of this.qoEditObj.lang.en.options) {
        status = (status && this.fieldValidate(o) && !this.fieldCheckDup(o, this.qoEditObj.lang.en.options) );
      }
    }
    this.canSave = status;
  }

  /**
   * fieldValidate(s: string)
   *
   * @param  {string}  s the string to validate
   * @return {boolean}   whether the string was valid
   */
  fieldValidate(s: string): boolean {
    return s && s.length > 0 && (/\S/.test(s));
  }

  /**
   * fieldCheckDup(s: string)
   *
   * @param  {string}   match the string to check
   * @param  {string[]} array the array to check in
   * @return {boolean}        whether there are duplicates if the string in the array
   */
  fieldCheckDup(match: string, array: string[]): boolean {
    return array.filter(s => s === match).length > 1;
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
    if (qo.lang.en && qo.lang.en.options) {
      qo.lang.en.options.push('');
    }
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
  <h1 md-dialog-title class="alignCenter">{{ 'Post results' | translate }}</h1>
  <div md-dialog-content align="center">
    <p>{{ 'Could not post your survey. Error:' | translate }}</p>
    <span class="error">
      {{data.status}} : {{data.message}}
    </span>
    <p>{{ 'The system cannot proceed until the issue has been resolved.' | translate }}</p>
  </div>
  <div md-dialog-actions align="center">
    <button md-raised-button color="primary" (click)="okay()">{{ 'Okay' | translate }}</button>
  </div>
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



@Component({
  selector: 'warn-responses-deletion',
  styleUrls: ['./create-survey.component.scss'],
  template: `
  <h1 md-dialog-title class="alignCenter">{{ 'Warning!' | translate }}</h1>
  <div md-dialog-content align="center">
    <p>{{ 'All responses to this survey will be lost if you proceed.' | translate }}</p>
    <br>
    <p>{{ 'Do you wish to proceed?' | translate }}</p>
  </div>
  <div md-dialog-actions align="center">
    <button md-raised-button color="warn" (click)="okay()">{{ 'yes' | translate }}</button>
    <button md-raised-button color="primary" (click)="abort()">{{ 'no' | translate }}</button>
  </div>
  `
})
export class WarnDeletionDialog {
  constructor(public dialogRef: MdDialogRef<WarnDeletionDialog>, @Inject(MD_DIALOG_DATA) public data: any) {}
  okay() {
    this.dialogRef.close('yes');
  }
  abort() {
    this.dialogRef.close('no');
  }
}
