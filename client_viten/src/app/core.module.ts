import { NgModule } from '@angular/core';

// Modules
import { SharedModule } from './shared.module';


// Components
import { LoginComponent } from './admin/login/login.component';
import { NewUserComponent } from './admin/new-user/new-user.component';



@NgModule({
  declarations: [
    LoginComponent,
    NewUserComponent,
  ],
  imports: [
    SharedModule,
  ],
  entryComponents: [
  ],
})
export class CoreModule { }
