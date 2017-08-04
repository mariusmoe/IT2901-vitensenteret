import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_guards/auth.guard';

import { LoginComponent } from './admin/login/login.component';
import { ChooseSurveyComponent } from './user/choose-survey/choose-survey.component';
import { NewUserComponent } from './admin/new-user/new-user.component';
import { ActiveSurveyComponent } from './user/active-survey/active-survey.component';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'survey/:surveyId', component: ActiveSurveyComponent },
  { path: 'choosesurvey', component: ChooseSurveyComponent },
  { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule', canActivate: [AuthGuard] },
  { path: 'register/:refLink', component: NewUserComponent },


  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
 imports: [
   RouterModule.forRoot(appRoutes)
 ],
 exports: [
   RouterModule
 ]
})
export class AppRoutingModule {}
