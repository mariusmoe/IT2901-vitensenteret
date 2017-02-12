import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageAdminComponent } from './admin/homepage-admin/homepage-admin.component';
import { SurveyCreateComponent } from './admin/survey-create/survey-create.component';
import { HomepageUserComponent } from './user/homepage-user/homepage-user.component';
import { AuthGuard } from './_guards/auth.guard';


const appRoutes: Routes = [
  {
    path: '',
    component:HomepageUserComponent
  },
  {
    path: 'admin',
    component: HomepageAdminComponent
  },
  {
    path: 'create-survey',
    component: SurveyCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
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
