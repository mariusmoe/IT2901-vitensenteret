import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SurveyService } from '../../_services/survey.service';
import { MdDialogRef } from '@angular/material';
import { MdSnackBar } from '@angular/material';
import { SimpleTimer } from 'ng2-simple-timer';

@Component({
  selector: 'app-quitsurvey-prompt',
  templateUrl: './quitsurvey-prompt.component.html',
  styleUrls: ['./quitsurvey-prompt.component.scss']
})
export class QuitsurveyPromptComponent {

  errorStr = "Feil kode";
  badRequest = "Have you remembered to set a exit code?";
  hasError = false;

  abortTimer: string;
  abortCounter = 0;

  constructor(
    private surveyService: SurveyService,
    public dialogRef: MdDialogRef<QuitsurveyPromptComponent>,
    private router: Router,
    public snackBar: MdSnackBar,
    private timer: SimpleTimer ) {
      this.timer.newTimer('1sec', 1);
      this.subscribePromptTimer();
    }

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

  cancelPrompt(){
    this.dialogRef.close();
    this.resetTimer();
  }

  openSnackBar(message: string, action: string){
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  /**
   * The subscribe-methods connects variables to timers. These handles connectivity to callback-methods
   */
   subscribePromptTimer() {
    if (this.abortTimer) {
      // Unsubscribe if timer Id is defined
      this.timer.unsubscribe(this.abortTimer);
      this.abortTimer = undefined;
      } else {
        // Subscribe if timer Id is undefined
        this.abortTimer = this.timer.subscribe('1sec', e => this.promptTimerCallback());
      }
    }


  /**
   * The timer-methods update the counters accordingly to realtime seconds, and aborts survey if time has passed over threshold
   */
   promptTimerCallback() {
     this.abortCounter++;
     if (this.abortCounter >= 20) {
       this.cancelPrompt();
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


}
