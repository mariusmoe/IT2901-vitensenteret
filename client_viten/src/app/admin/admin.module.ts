import { NgModule } from '@angular/core';

// Admin Router
import { AdminRoutingModule } from './admin.routing-module';


// Modules
import { SharedModule } from './../shared.module';
import { ChartsModule } from 'ng2-charts/ng2-charts';

// Utilities
import { FileUploadModule } from 'ng2-file-upload';
import { ClipboardModule } from 'ngx-clipboard';
import { DragulaModule } from 'ng2-dragula';

// Pipes
// import { AdminSurveysPipe } from './_pipes/adminSurveysPipe';

// Components
import { HomepageAdminComponent, DeleteSurveyDialog, PublishDialog } from './homepage-admin/homepage-admin.component';
import { AllSurveysComponent } from './all-surveys/all-surveys.component';
import { FolderOptionsDialog } from './all-surveys/all-surveys.component';
import { CreateSurveyComponent, SurveyAlternativesDialog, SurveyPublishDialog,
         WarnDeletionDialog } from './create-survey/create-survey.component';
import { AdminOutletComponent } from './admin-outlet/admin-outlet.component';
import { AdminSettingsComponent, DeleteDialog, ReferDialog, CredentialDialog } from './admin-settings/admin-settings.component';
import { SurveyRetrievalComponent } from './survey-retrieval/survey-retrieval.component';
import { ChartComponent } from './survey-retrieval/chart/chart.component';
import { NewCenterComponent } from './new-center/new-center.component';

// Services
import { UserFolderService } from '../_services/userFolder.service';


@NgModule({
  declarations: [
    HomepageAdminComponent,
    AllSurveysComponent,
    CreateSurveyComponent,
    SurveyAlternativesDialog,
    SurveyRetrievalComponent,
    ChartComponent,
    SurveyPublishDialog,
    AdminOutletComponent,
    AdminSettingsComponent,
    DeleteDialog,
    ReferDialog,
    CredentialDialog,
    FolderOptionsDialog,
    DeleteSurveyDialog,
    PublishDialog,
    NewCenterComponent,
    WarnDeletionDialog,
  ],
  imports: [
    SharedModule,
    ClipboardModule,
    DragulaModule,
    FileUploadModule,
    AdminRoutingModule,
    ChartsModule,
  ],
  entryComponents: [
    DeleteDialog,
    ReferDialog,
    SurveyAlternativesDialog,
    SurveyPublishDialog,
    CredentialDialog,
    DeleteSurveyDialog,
    WarnDeletionDialog,
    FolderOptionsDialog,
    PublishDialog,
  ],
  providers: [
    UserFolderService,
  ]
})
export class AdminModule { }
