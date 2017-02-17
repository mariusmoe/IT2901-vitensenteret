import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageAdminComponent } from './admin/homepage-admin/homepage-admin.component';
import { CreateSurveyComponent } from './admin/create-survey/create-survey.component';
import { HomepageUserComponent } from './user/homepage-user/homepage-user.component';
import { AuthGuard } from './_guards/auth.guard';
import { LoginComponent } from './admin/login/login.component';
import { TestRestAPIComponent } from './admin/test-rest-api/test-rest-api.component';

const appRoutes: Routes = [
  { path: '', component:HomepageUserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin/:surveyId', component: HomepageAdminComponent },
  { path: 'admin', component: HomepageAdminComponent },
  { path: 'test', component: TestRestAPIComponent },
  { path: 'create', component: CreateSurveyComponent, canActivate: [AuthGuard] },
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
