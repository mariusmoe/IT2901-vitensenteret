import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app.routing-module';
import { MaterialModule } from '@angular/material';
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { HomepageAdminComponent } from './admin/homepage-admin/homepage-admin.component';
import { SurveyCreateComponent } from './admin/survey-create/survey-create.component';
import { HomepageUserComponent } from './user/homepage-user/homepage-user.component';
import { SurveyRetrievalComponent } from './admin/survey-retrieval/survey-retrieval.component';
import { SurveyBarChartComponent } from './admin/survey-retrieval/survey-barchart.component';
import { SurveyDoughnutChartComponent } from './admin/survey-retrieval/survey-doughnut-chart.component'


@NgModule({
  declarations: [
    AppComponent,
    HomepageAdminComponent,
    SurveyCreateComponent,
    HomepageUserComponent,
    SurveyRetrievalComponent,
    SurveyBarChartComponent,
    SurveyDoughnutChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule.forRoot(),
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
