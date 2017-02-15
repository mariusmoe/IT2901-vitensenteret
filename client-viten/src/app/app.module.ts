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
import { StartSurveyComponent } from './user/start-survey/start-survey.component';
import { ChooseSurveyComponent } from './user/choose-survey/choose-survey.component';






@NgModule({
  declarations: [
    AppComponent,
    HomepageAdminComponent,
    SurveyCreateComponent,
    HomepageUserComponent,
    StartSurveyComponent,
    ChooseSurveyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
