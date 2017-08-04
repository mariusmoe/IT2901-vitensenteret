import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { ReactiveFormsModule } from '@angular/forms';



// move to user
import { SimpleTimer } from 'ng2-simple-timer';


// services
import { AuthenticationService } from './_services/authentication.service';
import { SurveyService } from './_services/survey.service';
import { CenterService } from './_services/center.service';
import { TranslateService } from './_services/translate.service';
import { TranslatePipe } from './_pipes/translate';
import { DatePipe } from '@angular/common';
import { AdminSurveysPipe } from './_pipes/adminSurveysPipe';


import { AuthGuard } from './_guards/auth.guard';
import { TRANSLATION_PROVIDERS } from './translate/translate';





@NgModule({
  imports: [
  ],
  declarations: [
    TranslatePipe,
    AdminSurveysPipe,
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    SurveyService,
    CenterService,
    TRANSLATION_PROVIDERS,
    TranslateService,
    SimpleTimer,
    DatePipe
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,

    TranslatePipe,
    AdminSurveysPipe,
  ]
})
export class SharedModule { }
