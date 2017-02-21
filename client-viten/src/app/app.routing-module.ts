import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageAdminComponent } from './admin/homepage-admin/homepage-admin.component';
import { SurveyCreateComponent } from './admin/survey-create/survey-create.component';
import { HomepageUserComponent } from './user/homepage-user/homepage-user.component';
import { StartSurveyComponent} from './user/start-survey/start-survey.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './admin/login/login.component';
import { TestRestAPIComponent } from './admin/test-rest-api/test-rest-api.component';

import{ChooseSurveyComponent} from  './user/choose-survey/choose-survey.component';
const appRoutes: Routes = [
  { path: '', component:HomepageUserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/:surveyId', component: HomepageAdminComponent },
  { path: 'admin', component: HomepageAdminComponent },
  { path: 'test', component: TestRestAPIComponent },
  { path:'choose-survey',component: ChooseSurveyComponent},
  { path: 'create-survey', component: SurveyCreateComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
  {
    path:'choose-survey',
    component:ChooseSurveyComponent
  }
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
