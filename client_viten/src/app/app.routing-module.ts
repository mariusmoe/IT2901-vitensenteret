import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageAdminComponent } from './admin/homepage-admin/homepage-admin.component';
import { CreateSurveyComponent } from './admin/create-survey/create-survey.component';
import { HomepageUserComponent } from './user/homepage-user/homepage-user.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './admin/login/login.component';
import { TestRestAPIComponent } from './admin/test-rest-api/test-rest-api.component';
import { AdminOutletComponent } from './admin/admin-outlet/admin-outlet.component';
import { ChooseSurveyComponent } from './user/choose-survey/choose-survey.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'choosesurvey', component: ChooseSurveyComponent },
  { path: 'admin', component: AdminOutletComponent,
    children: [
      { path: 'test', component: TestRestAPIComponent },
      { path: 'editsurvey', component: CreateSurveyComponent, canActivate: [AuthGuard] },
      { path: 'editsurvey/:surveyId', component: CreateSurveyComponent, canActivate: [AuthGuard] },
      // these two placed further down due to priority issues
      { path: '', component: HomepageAdminComponent, pathMatch: 'full'  },
      { path: ':surveyId', component: HomepageAdminComponent },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: '', component:HomepageUserComponent },
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
