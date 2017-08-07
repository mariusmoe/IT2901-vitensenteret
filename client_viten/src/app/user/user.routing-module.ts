import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActiveSurveyComponent } from './active-survey/active-survey.component';
import { ChooseSurveyComponent } from './choose-survey/choose-survey.component';

const userRoutes: Routes = [
  { path: '', component: ChooseSurveyComponent },
  { path: ':surveyId' , component: ActiveSurveyComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
]; // , pathMatch: 'full'

@NgModule({
 imports: [
   RouterModule.forChild(userRoutes)
 ],
 exports: [
   RouterModule
 ]
})
export class UserRoutingModule {}
