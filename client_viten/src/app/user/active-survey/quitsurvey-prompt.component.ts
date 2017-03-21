import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyService } from '../../_services/survey.service';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-quitsurvey-prompt',
  templateUrl: './quitsurvey-prompt.component.html',
  styleUrls: ['./quitsurvey-prompt.component.scss']
})
export class QuitsurveyPromptComponent {

  private errorStr = "Feil kode";
  private badRequest = "Have you remembered to set a exit code?";
  private hasError = false;

  constructor(private surveyService: SurveyService, public dialogRef: MdDialogRef<QuitsurveyPromptComponent>, private router: Router) {}

  quitSurvey(code: string){

    const sub = this.surveyService.checkChoosesurvey(code)
        .subscribe(result => {
          console.log(result);
          if(result === true){
            this.router.navigate(['/choosesurvey']);
          }
          else{
            this.errorStr = 'Feil kode';
            this.hasError = true;
          }
        },
        error => {
          sub.unsubscribe();
          this.hasError = true;
          console.log(this.badRequest);
        }
      );
  }
}
