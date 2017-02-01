import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app.routing-module';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin.component';
import { HomepageComponent } from './components/homepage.component';
import { SurveyCreateComponent } from './components/surveycreate.component';



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    HomepageComponent,
    SurveyCreateComponent
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
