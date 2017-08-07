import { Component, HostListener, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { CenterService } from '../../_services/center.service';
import { TranslateService } from '../../_services/translate.service';
import { MdSnackBar } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { interval } from 'rxjs/Observable/interval';

@Component({
  selector: 'app-quitsurvey-prompt',
  templateUrl: './quitsurvey-prompt.component.html',
  styleUrls: ['./quitsurvey-prompt.component.scss']
})
export class QuitsurveyPromptComponent implements OnDestroy {

  codeForm: FormGroup;

  abortTimer: string;
  abortCounter = 0;

  private timerSub: Subscription;

  constructor(
    private centerService: CenterService,
    private translateService: TranslateService,
    public dialogRef: MdDialogRef<QuitsurveyPromptComponent>,
    private router: Router,
    public snackBar: MdSnackBar,
    private fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) public data: any) {
      this.timerSub = interval(1 * 1000).subscribe(() => {
        this.promptTimerCallback();
      });

      this.codeForm = fb.group({
        'code': [null, Validators.required]
      });
    }


  ngOnDestroy() {
    this.timerSub.unsubscribe();
  }

  quitSurvey(code: string) {

    const sub = this.centerService.exitSurvey(code, this.data.survey.center)
        .subscribe(result => {
          if (result === true) {
            this.router.navigate(['/choosesurvey']);
            this.dialogRef.close();
          } else {
            this.openSnackBar(this.translateService.instant('Incorrect code'), 'OK');
          }
          sub.unsubscribe();
          this.timerSub.unsubscribe();
        },
        error => {
          sub.unsubscribe();
          this.timerSub.unsubscribe();
          this.openSnackBar(this.translateService.instant('Incorrect code'), 'OK');
        }
      );
  }

  cancelPrompt() {
    this.dialogRef.close();
    this.resetTimer();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
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
