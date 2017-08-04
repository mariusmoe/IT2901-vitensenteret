import { NgModule } from '@angular/core';

// Modules
import { SharedModule } from './shared.module';


// Components
import { LoginComponent } from './admin/login/login.component';
import { NewUserComponent } from './admin/new-user/new-user.component';

// user portal / module
import { ChooseSurveyComponent } from './user/choose-survey/choose-survey.component';
import { ActiveSurveyComponent } from './user/active-survey/active-survey.component';
import { SmileyComponent } from './user/smiley/smiley.component';
import { StarsComponent } from './user/stars/stars.component';
import { FreetxtComponent } from './user/freetxt/freetxt.component';
import { YesNoComponent } from './user/yes-no/yes-no.component';
import { MultiplechoiceComponent } from './user/multiplechoice/multiplechoice.component';
import { SinglechoiceComponent } from './user/singlechoice/singlechoice.component';
import { NicknameComponent } from './user/nickname/nickname.component';
import { QuitsurveyPromptComponent } from './user/active-survey/quitsurvey-prompt.component';


@NgModule({
  declarations: [
    LoginComponent,
    NewUserComponent,
    ChooseSurveyComponent,
    ActiveSurveyComponent,
    SmileyComponent,
    StarsComponent,
    FreetxtComponent,
    YesNoComponent,
    MultiplechoiceComponent,
    SinglechoiceComponent,
    NicknameComponent,
    QuitsurveyPromptComponent,
  ],
  imports: [
    SharedModule,
  ],
  entryComponents: [
    QuitsurveyPromptComponent
  ],
})
export class CoreModule { }
