import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-quitsurvey-prompt',
  templateUrl: './quitsurvey-prompt.component.html',
  styleUrls: ['./quitsurvey-prompt.component.scss']
})
export class QuitsurveyPromptComponent {

  constructor(public dialogRef: MdDialogRef<QuitsurveyPromptComponent>) {}

}
