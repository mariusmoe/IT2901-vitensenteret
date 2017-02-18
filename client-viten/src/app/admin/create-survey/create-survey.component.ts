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
  private submitLoading: boolean = false;
  private startupLoading: boolean = true;
  private error: string;
  private englishEnabled: boolean = false;
  private survey: Survey;
  private isPatch: boolean = false;

  private allowedModes = ['binary', 'star', 'multi', 'smily', 'text'];
  private allowedModesVerbose = {
    'binary': 'Yes/No',
    'star': '5 Stars',
    'multi': 'Multiple Choice',
    'smily': 'Smily',
    'text': 'Free Text'
  };
  private stringPattern = /\S/;
  private fieldIsRequiredMsg = 'This field is required.';
  private tooltipDeleteQuestionMsg = 'Deletes this particular question! Careful!';
  private tooltipSelectQuestionModeMsg = 'Select your question mode here!';
  private tooltipSubmitSurveyMsg = 'Several fields are required. Verify that you have filled out all required fields.';

  private maxQuestionLength = 50; // TODO: arbitrary chosen! discuss!

  constructor(private dialog: MdDialog, private surveyService: SurveyService,
    private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    if (this.route.snapshot.params['surveyId']){
      this.surveyService.getSurvey(this.route.snapshot.params['surveyId']).subscribe(result => {
        if (!result) {
          console.log("DEBUG: BAD surveyId param from router!");
          return;
        }
        this.survey = result;
        console.log(this.survey);
        this.isPatch = true;

        // TODO: fix me! this is a slightly awkward way to detect english.
        if (this.survey.questionlist[0].lang.en && this.survey.questionlist[0].lang.en.txt.length > 0) {
          this.englishEnabled = true;
        }
        this.startupLoading = false;
      });
    } else {
      this.survey = {
        "name": "",
        "comment": "",
        "date": new Date().toISOString(),
        "active": true,
        "questionlist": [],
        "endMessage": {
          "no": "",
          "en": "",
        }
      }
      this.startupLoading = false;
    }
  }



  // private changeEnglishState(state) {
  //   if (!state) {
  //     let dialogRef = this.dialog.open(DisableEnglishDialog, {
  //       height: '200px',
  //       width: '400px',
  //     });
  //     dialogRef.afterClosed().subscribe( result => {
  //       if (!state) {
  //         for (let qo of this.survey.questionlist) {
  //           delete qo.lang.en;
  //         }
  //       }
  //       this.englishEnabled = state;
  //     })
  //   } else {
  //     for (let qo of this.survey.questionlist) {
  //       qo.lang.en = new Question();
  //       qo.lang.en.options = [];
  //     }
  //     this.englishEnabled = state
  //   }
  // }

  private changeEnglishState(state) {
    if (!state) {
      for (let qo of this.survey.questionlist) {
        delete qo.lang.en;
      }
    } else {
      for (let qo of this.survey.questionlist) {
        qo.lang.en = { txt: '', options: [] }
      }
    }
    this.englishEnabled = state
  }

  private submitSurvey() {
    console.log(this.survey);

    let f = function(result: Survey) {
      console.log(result);
      // 1 verify survey
      // 2 if success, redirect, else give feedback to the user
      console.log("TODO: REDIRECT ME TO LIST OF SURVEYS!")
    }
    if (this.isPatch) {
      console.log("PATCHING...")
      this.surveyService.patchSurvey(this.survey._id, this.survey).subscribe(result => f(result));
    } else {
      console.log("POSTING...")
      this.surveyService.postSurvey(this.survey).subscribe(result => f(result));
    }


  }

  private addQuestion() {
    let qo: QuestionObject = {
      mode: 'smily',
      lang: {
        no: { txt: '', options: [] }
      }
    }
    if (this.englishEnabled) {
      qo.lang.en = { txt: '', options: [] }
    }
    this.survey.questionlist.push(qo);
  }
  private removeQuestion(index: number) {
    this.survey.questionlist.splice(index,1);
  }


  private addOption(qo: QuestionObject) {
    qo.lang.no.options.push("");
    if (this.englishEnabled) {
      qo.lang.en.options.push("");
    }
  }
  private removeOption(qo: QuestionObject, index: number) {
    qo.lang.no.options.splice(index, 1);
    if (this.englishEnabled) {
      qo.lang.en.options.splice(index, 1);
    }
  }


}



@Component({
  selector: 'disable-english-dialog',
  template: `
  <p>Are you sure you want to disable English for this survey?</p>
  <p>Any questions already written in English will be deleted!</p>
  <button md-raised-button type="button" (click)="dialogRef.close(true)">Yes</button>
  <button md-raised-button type="button" (click)="dialogRef.close(false)">No</button>`
})
export class DisableEnglishDialog {
  constructor(public dialogRef: MdDialogRef<DisableEnglishDialog>) { }
}
