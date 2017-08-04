import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../_guards/auth.guard';

import { HomepageAdminComponent } from './homepage-admin/homepage-admin.component';
import { CreateSurveyComponent } from './create-survey/create-survey.component';
import { AdminOutletComponent } from './admin-outlet/admin-outlet.component';
import { SurveyRetrievalComponent } from './survey-retrieval/survey-retrieval.component';
import { NewCenterComponent } from './new-center/new-center.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { NewUserComponent } from './new-user/new-user.component';


const adminRoutes: Routes = [
  { path: '' , component: AdminOutletComponent, canActivate: [AuthGuard],
   children: [
     { path: 'center', component: NewCenterComponent, canActivate: [AuthGuard] },
     { path: 'settings', component: AdminSettingsComponent, canActivate: [AuthGuard] },
     { path: 'center/:centerId', component: NewCenterComponent, canActivate: [AuthGuard] },
     { path: 'editsurvey', component: CreateSurveyComponent, canActivate: [AuthGuard] },
     { path: 'editsurvey/:surveyId', component: CreateSurveyComponent, canActivate: [AuthGuard] },
     { path: 'editsurvey/:surveyId/prepost', component: CreateSurveyComponent, canActivate: [AuthGuard] },
     // these two placed further down due to priority issues
     { path: ':surveyId', component: HomepageAdminComponent, canActivate: [AuthGuard] },
     { path: '', component: HomepageAdminComponent, pathMatch: 'full', canActivate: [AuthGuard]   },
     { path: '**', redirectTo: '', pathMatch: 'full' }
   ]
},

];

@NgModule({
 imports: [
   RouterModule.forChild(adminRoutes)
 ],
 exports: [
   RouterModule
 ]
})
export class AdminRoutingModule {}
