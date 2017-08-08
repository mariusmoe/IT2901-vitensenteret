import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './_guards/auth.guard';

import { LoginComponent } from './admin/login/login.component';
import { NewUserComponent } from './admin/new-user/new-user.component';


const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'survey', loadChildren: 'app/user/user.module#UserModule' },
  { path: 'choosesurvey', redirectTo: 'survey', pathMatch: 'full' },
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
