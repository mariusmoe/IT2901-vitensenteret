import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyService } from '../../_services/survey.service';
import { MdDialogRef } from '@angular/material';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-quitsurvey-prompt',
  templateUrl: './quitsurvey-prompt.component.html',
  styleUrls: ['./quitsurvey-prompt.component.scss']
})
export class QuitsurveyPromptComponent {

  private errorStr = "Feil kode";
  private badRequest = "Have you remembered to set a exit code?";
  private hasError = false;

  constructor(
    private surveyService: SurveyService,
    public dialogRef: MdDialogRef<QuitsurveyPromptComponent>,
    private router: Router,
    public snackBar: MdSnackBar ) {}

  quitSurvey(code: string){

    const sub = this.surveyService.checkChoosesurvey(code)
        .subscribe(result => {
          if(result === true){
            this.router.navigate(['/choosesurvey']);
            this.dialogRef.close();
            sub.unsubscribe();
          }
          else{
            this.errorStr = 'Feil kode';
            this.hasError = true;
          }
        },
        error => {
          sub.unsubscribe();
          this.hasError = true;
          this.openSnackBar("Feil kode","OK");
          console.log(this.badRequest);
        }
      );
  }

  openSnackBar(message: string, action: string){
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
