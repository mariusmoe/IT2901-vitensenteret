import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app.routing-module';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HomepageAdminComponent } from './admin/homepage-admin/homepage-admin.component';
import { HomepageUserComponent } from './user/homepage-user/homepage-user.component';
import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService } from './_services/authentication.service';
import { LoginComponent } from './admin/login/login.component';
import { SurveyService } from './_services/survey.service';
import { AllSurveysComponent } from './admin/all-surveys/all-surveys.component';

import { ReactiveFormsModule } from '@angular/forms';
import { CreateSurveyComponent, SurveyAlternativesDialog, SurveyPublishDialog } from './admin/create-survey/create-survey.component';
import { AdminOutletComponent } from './admin/admin-outlet/admin-outlet.component';
import { AdminSettingsComponent, DeleteDialog, ReferDialog, CredentialDialog } from './admin/admin-settings/admin-settings.component';

import { AdminSurveysPipe } from './_pipes/adminSurveysPipe';

import { ClipboardModule } from 'ngx-clipboard';
import { DragulaModule } from 'ng2-dragula';

import { TranslatePipe } from './_pipes/translate';
import { TranslateService } from './_services/translate.service';
import { TRANSLATION_PROVIDERS } from './translate/translate';

@NgModule({
  declarations: [
    AppComponent,
    HomepageAdminComponent,
    HomepageUserComponent,
    LoginComponent,
    AllSurveysComponent,
    CreateSurveyComponent,
    SurveyAlternativesDialog,
    SurveyPublishDialog,
    AdminOutletComponent,
    AdminSettingsComponent,
    DeleteDialog,
    ReferDialog,
    AdminSurveysPipe,
    TranslatePipe
    CredentialDialog,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
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
    CredentialDialog
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    SurveyService,
    TRANSLATION_PROVIDERS,
    TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
