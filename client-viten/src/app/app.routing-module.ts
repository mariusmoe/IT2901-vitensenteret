import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent } from './components/homepage.component';
import { AdminComponent } from './components/admin.component';


const appRoutes: Routes = [
  {
    path: '',
    component: HomepageComponent
  },
  {
    path: 'admin',
    component: AdminComponent
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
