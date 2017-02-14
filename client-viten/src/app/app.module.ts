import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app.routing-module';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { HomepageAdminComponent } from './admin/homepage-admin/homepage-admin.component';
import { SurveyCreateComponent } from './admin/survey-create/survey-create.component';
import { HomepageUserComponent } from './user/homepage-user/homepage-user.component';
import { AuthGuard } from './_guards/auth.guard';
import { AuthenticationService } from './_services/authentication.service';
import { LoginComponent } from './admin/login/login.component';
import { SurveyService } from './_services/survey.service';
import { AllSurveysComponent } from './admin/survey-list/all-surveys/all-surveys.component';
import { LittleSurveyComponent } from './admin/survey-list/little-survey/little-survey.component';




@NgModule({
  declarations: [
    AppComponent,
    HomepageAdminComponent,
    SurveyCreateComponent,
    HomepageUserComponent,
    LoginComponent,
    AllSurveysComponent,
    LittleSurveyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule.forRoot()
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    SurveyService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
