import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app.routing-module';
import { MaterialModule } from '@angular/material';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SimpleTimer } from 'ng2-simple-timer';
import { HostListener } from '@angular/core';

import { AppComponent } from './app.component';
import { HomepageAdminComponent } from './admin/homepage-admin/homepage-admin.component';
import { HomepageUserComponent } from './user/homepage-user/homepage-user.component';
import { ChooseSurveyComponent } from './user/choose-survey/choose-survey.component';
import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService } from './_services/authentication.service';
import { LoginComponent } from './admin/login/login.component';
import { SurveyService } from './_services/survey.service';
import { AllSurveysComponent } from './admin/all-surveys/all-surveys.component';

import { ReactiveFormsModule } from '@angular/forms';
import { CreateSurveyComponent, SurveyAlternativesDialog, SurveyPublishDialog } from './admin/create-survey/create-survey.component';
import { AdminOutletComponent } from './admin/admin-outlet/admin-outlet.component';
import { AdminSettingsComponent, DeleteDialog, ReferDialog, CredentialDialog } from './admin/admin-settings/admin-settings.component';
import { SurveyRetrievalComponent } from './admin/survey-retrieval/survey-retrieval.component';
import { BarChartComponent } from './admin/survey-retrieval/chart/chart.component';

import { ActiveSurveyComponent } from './user/active-survey/active-survey.component';
import { SmileyComponent } from './user/smiley/smiley.component';
import { StarsComponent } from './user/stars/stars.component';
import { FreetxtComponent } from './user/freetxt/freetxt.component';
import { YesNoComponent } from './user/yes-no/yes-no.component';
import { MultiplechoiceComponent } from './user/multiplechoice/multiplechoice.component';
import { AdminSurveysPipe } from './_pipes/adminSurveysPipe';

import { ClipboardModule } from 'ngx-clipboard';
import { DragulaModule } from 'ng2-dragula';
import { NewUserComponent } from './admin/new-user/new-user.component';

import { TRANSLATION_PROVIDERS } from './translate/translate';
import { TranslateService } from './_services/translate.service';
import { TranslatePipe } from './_pipes/translate';
import { DatePipe } from '@angular/common';
import { LogoComponentComponent } from './logo-component/logo-component.component';
import { SinglechoiceComponent } from './user/singlechoice/singlechoice.component';
import { QuitsurveyPromptComponent } from './user/active-survey/quitsurvey-prompt.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageAdminComponent,
    HomepageUserComponent,
    ChooseSurveyComponent,
    LoginComponent,
    AllSurveysComponent,
    CreateSurveyComponent,
    SurveyAlternativesDialog,
    ActiveSurveyComponent,
    SurveyRetrievalComponent,
    BarChartComponent,
    SurveyPublishDialog,
    AdminOutletComponent,
    AdminSettingsComponent,
    DeleteDialog,
    ReferDialog,
    NewUserComponent,
    SmileyComponent,
    StarsComponent,
    FreetxtComponent,
    YesNoComponent,
    ReferDialog,
    CredentialDialog,
    AdminSurveysPipe,
    TranslatePipe,
    MultiplechoiceComponent,
    LogoComponentComponent,
    SinglechoiceComponent,
    QuitsurveyPromptComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    ChartsModule,
    ClipboardModule,
    DragulaModule,
    MaterialModule.forRoot()
  ],
  entryComponents: [
    SurveyAlternativesDialog,
    DeleteDialog,
    ReferDialog,
    SurveyAlternativesDialog,
    SurveyPublishDialog,
    CredentialDialog,
    QuitsurveyPromptComponent
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    SurveyService,
    TRANSLATION_PROVIDERS,
    TranslateService,
    SimpleTimer,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
