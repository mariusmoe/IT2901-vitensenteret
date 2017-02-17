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
import { TestRestAPIComponent } from './admin/test-rest-api/test-rest-api.component';

import { ReactiveFormsModule } from '@angular/forms';
import { CreateSurveyComponent } from './admin/create-survey/create-survey.component';



@NgModule({
  declarations: [
    AppComponent,
    HomepageAdminComponent,
    HomepageUserComponent,
    LoginComponent,
    AllSurveysComponent,
    TestRestAPIComponent,
    CreateSurveyComponent,
    DisableEnglishDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    SurveyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
