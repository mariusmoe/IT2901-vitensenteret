import { Component, OnInit, Input, Inject } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { Survey, QuestionObject, Lang, Question, EndMessage } from '../../_models/survey';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {
  private loading: boolean = false;
  private error: string;
  private englishEnabled: boolean = false;
  @Input() survey: Survey; // allow taking in a survey as input. This is used for the patch feature
  private isPatch: boolean = false;

  private allowedModes = ['binary', 'star', 'multi', 'smily', 'text'];
  private stringPattern = /\S/;


  constructor(private dialog: MdDialog, private surveyService: SurveyService) {
    if (!this.survey) {
      this.survey = new Survey();
      this.survey.name = "";
      this.survey.active = true;
      this.survey.date = new Date().toISOString();
      this.survey.questionlist = [];
      this.survey.endMessage = new EndMessage();
    } else {
      this.isPatch = true;
    }
  }

  ngOnInit() {
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
        qo.lang.en = new Question();
        qo.lang.en.options = [];
      }
    }
    this.englishEnabled = state
  }

  private submitSurvey() {
    console.log(this.survey);

    let f = function(result: Survey) {
      // 1 verify survey
      // 2 if success, redirect, else give feedback to the user
      console.log("TODO: REDIRECT ME TO LIST OF SURVEYS!")
    }
    if (this.isPatch) {
      this.surveyService.patchSurvey(this.survey._id, this.survey).subscribe(result => f(result));
    } else {
      this.surveyService.postSurvey(this.survey).subscribe(result => f(result));
    }


  }

  private addQuestion() {
    let qo = new QuestionObject();
    qo.mode = 'smily'; // default mode
    qo.lang = new Lang();
    qo.lang.no = new Question();
    qo.lang.no.options = [];
    if (this.englishEnabled) {
      qo.lang.en = new Question();
      qo.lang.en.options = [];
    }

    this.survey.questionlist.push(qo);
  }
  private removeQuestion(index: number) {
    this.survey.questionlist.splice(index,1);
  }


  private addOption(qo: QuestionObject) {
    qo.lang.no.options.push("1");
    if (this.englishEnabled) {
      qo.lang.en.options.push("1");
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
