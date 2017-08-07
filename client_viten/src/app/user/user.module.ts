import { NgModule } from '@angular/core';

// User Router
import { UserRoutingModule } from './user.routing-module';


// Modules
import { SharedModule } from './../shared.module';

// user portal / module
import { ActiveSurveyComponent } from './active-survey/active-survey.component';
import { SmileyComponent } from './smiley/smiley.component';
import { StarsComponent } from './stars/stars.component';
import { FreetxtComponent } from './freetxt/freetxt.component';
import { YesNoComponent } from './yes-no/yes-no.component';
import { MultiplechoiceComponent } from './multiplechoice/multiplechoice.component';
import { SinglechoiceComponent } from './singlechoice/singlechoice.component';
import { NicknameComponent } from './nickname/nickname.component';
import { QuitsurveyPromptComponent } from './active-survey/quitsurvey-prompt.component';

import { ChooseSurveyComponent } from './choose-survey/choose-survey.component';



@NgModule({
  declarations: [
    ActiveSurveyComponent,
    SmileyComponent,
    StarsComponent,
    FreetxtComponent,
    YesNoComponent,
    MultiplechoiceComponent,
    SinglechoiceComponent,
    NicknameComponent,
    QuitsurveyPromptComponent,
    ChooseSurveyComponent
  ],
  imports: [
    UserRoutingModule,
    SharedModule,
  ],
  entryComponents: [
    QuitsurveyPromptComponent,
  ],
  providers: [
  ]
})
export class UserModule { }
