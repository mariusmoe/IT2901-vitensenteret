import { Component, OnInit, Inject } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { Survey, QuestionObject } from '../../_models/survey';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {
  // COMPONENT VARIABLES
  private submitLoading: boolean = false;
  private startupLoading: boolean = true;
  private englishEnabled: boolean = false;

  // SURVEY VARIABLES
  private survey: Survey;
  private maxQuestionLength = 50; // TODO: arbitrary chosen! discuss!
  private isPatch: boolean = false;
  private allowedModes = ['binary', 'star', 'multi', 'smily', 'text'];
  private allowedModesVerbose = {
    'binary': 'Yes/No',
    'star': '5 Stars',
    'multi': 'Multiple Choice',
    'smily': 'Smily',
    'text': 'Free Text'
  };

  // FORMATTING VARIABLES
  private stringPattern = /\S/;

  // TOOLTIP LOCALES
  private fieldIsRequiredMsg = 'This field is required.';
  private tooltipDeleteQuestionMsg = 'Deletes this particular question! Careful!';
  private tooltipSelectQuestionModeMsg = 'Select your question mode here!';
  private tooltipSubmitSurveyMsg = 'Several fields are required. Verify that you have filled out all required fields.';


  /**
   * constructor
   *
   * uses MdDialog, SurveyService, Router and ActivatedRoute
   */
  constructor(private dialog: MdDialog, private surveyService: SurveyService,
    private router: Router, private route: ActivatedRoute) {

  }


  /**
   * ngOnInit()
   *
   * Executes when DOM is about to initialize. DOM is to render once this finishes.
   */
  ngOnInit() {
    // If we have a router parameter, we should attempt to use that first.
    if (this.route.snapshot.params['surveyId']){
      this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {
        if (!result) {
          console.log("DEBUG: BAD surveyId param from router!");
          // TODO: Redirect to base create survey ?
          return;
        }
        this.survey = result;
        console.log(this.survey);
        this.isPatch = true;

        // TODO: fix me! this is a slightly awkward way to detect english.
        if (this.survey.questionlist[0].lang.en) {
          this.englishEnabled = true;
        }
        this.startupLoading = false;
      });
      return;
    }
    // Set defaults seeing we had no router parameter
    this.survey = {
      "name": "",
      "comment": "",
      "date": new Date().toISOString(),
      "active": true,
      "questionlist": [],
      "endMessage": {
        "no": "",
        "en": "", // do not remove. see submitSurvey for handling of english properties.
      }
    }
    this.startupLoading = false;
  }



  /**
   * submitSurvey()
   *
   * Sends a http POST or a http PATCH request with the survey to the server.
   */
  private submitSurvey() {
    let clone: Survey = JSON.parse(JSON.stringify(this.survey));

    // remove options-properties of non-multi questions
    for (let qo of clone.questionlist) {
      if (qo.mode != 'multi') {
        delete qo.lang.no.options;
        delete qo.lang.en.options;
      }
    }
    // remove english fields from our submitted survey if it is not enabled
    if (!this.englishEnabled) {
      delete clone.endMessage.en;
      for (let qo of clone.questionlist) {
        delete qo.lang.en;
      }
    }
    console.log(clone);
    // Execute the following when we've gotten a response from the server
    let f = (result: Survey) => {
      console.log(result);
      // 1 verify survey
      // 2 if success, redirect, else give feedback to the user
      console.log("TODO: REDIRECT ME TO LIST OF SURVEYS!")
    }
    // Send request to the server; either PATCH or POST.
    if (this.isPatch) {
      this.surveyService.patchSurvey(clone._id, clone).subscribe(result => f(result));
    } else {
      this.surveyService.postSurvey(clone).subscribe(result => f(result));
    }
  }


  /**
   * addQuestion()
   *
   * Adds a question to the survey form
   */
  private addQuestion() {
    let qo: QuestionObject = {
      mode: 'smily',
      lang: {
        no: { txt: '' },
        en: { txt: '' },
      }
    }
    this.survey.questionlist.push(qo);
  }

  /**
   * removeQuestion(index: number)
   *
   * @param index: number - the index of the question to remove
   * Removes the n'th question, where n is specified by the index param.
   */
  private removeQuestion(index: number) {
    this.survey.questionlist.splice(index,1);
  }


  /**
   * setAlternatives(qo: QuestionObject)
   *
   * @param qo: QuestionObject - the questionObject on which to add alternatives
   * TODO: FIX ME
   * Launches the SurveyAlternatives Dialog (TO BE IMPLEMENTED BELOW)
   */
  private setAlternatives(qo: QuestionObject) {
    console.log("TODO: IMPLEMENT ME");
  }

  /**
   * addOption(qo: QuestionObject)
   *
   * @param qo: QuestionObject - the questionObject on which to add an option
   * TODO: FIX ME
   * Adds an option to the SurveyAlternatives Dialog (TO BE IMPLEMENTED BELOW)
   * and sets defaults in the survey object
   */
  private addOption(qo: QuestionObject) {
    if (!qo.lang.no.options) {
      qo.lang.no.options = [];
      qo.lang.en.options = [];
    }
    qo.lang.no.options.push("");
    qo.lang.en.options.push("");
  }
  /**
   * removeOption(qo: QuestionObject, index: number)
   *
   * @param qo: QuestionObject - the questionObject on which to remove an option
   * @param index: number - the index of the option to remove
   * TODO: FIX ME
   * Removes an option to the SurveyAlternatives Dialog (TO BE IMPLEMENTED BELOW)
   * and removes it from the survey object
   */
  private removeOption(qo: QuestionObject, index: number) {
    qo.lang.no.options.splice(index, 1);
    qo.lang.en.options.splice(index, 1);
    if (qo.lang.no.options.length == 0) {
      delete qo.lang.no.options;
      delete qo.lang.en.options;
    }
  }
}



@Component({
  selector: 'alternatives-dialog',
  template: `<p>Fix me!</p>`
})
export class SurveyAlternativesDialog {
  constructor(public dialogRef: MdDialogRef<SurveyAlternativesDialog>) { }
}
