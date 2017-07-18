import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../_models/index';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../../_services/authentication.service';
import { CenterService } from '../../_services/center.service';
import { TranslateService } from '../../_services/translate.service';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit, OnDestroy {

  private userSub;
  private userListSub;
  public  user: User;
  newEmailForm: FormGroup;
  private email = '';
  private userList: User[] = [];
  private selectedRow: number;
  private referralURL = '';
  private emailSub: Subscription;
  selectedLanguage;

  public  dialogRef: MdDialogRef<DeleteDialog>;

  constructor(
    private router: Router,
    private service: AuthenticationService,
    private centerService: CenterService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private fb: FormBuilder,
    public languageService: TranslateService) {
      this.selectedLanguage = languageService.getCurrentLang();
      this.user = this.service.getUser();
      if (this.user.role === 'sysadmin') {
        this.getUsers(); // TODO: if user ISN'T sysadmin, do not do execute getUsers()
      }
      this.newEmailForm = fb.group({
        'newEmail': [null, Validators.required],
      });

    }



  ngOnInit() {
  }

  ngOnDestroy() {
    // this.emailSub.unsubscribe();
  }

  /**
   * Sets the language to the selected value
   */
  setSelectedLanguage() {
    this.languageService.use(this.selectedLanguage);
  }

  /**
   * Changes the exit-survey password
   * @param  {string} password new password
   */
  changeExitSurveyPassword(password: string) {
    this.centerService.exitSurveyUpdatePassword(password)
      .subscribe(result => {
        this.openSnackBar(this.languageService.instant('Password changed'), 'SUCCESS');
      },
      error => {
        this.openSnackBar(this.languageService.instant('Could not change your password'), 'FAILURE');
        console.error(error);
    });
  }

  /**
   * changes user email
   * @param  {string} newEmail the new email to be used
   */
  changeEmail(newEmail: string) {
    this.service.changeEmail(newEmail)
        .subscribe(result => {
          if (result === true) {
            const config: MdDialogConfig = {
              data: {
                credential: 'email'
              },
              disableClose: true,
              width: '400px'
            };
            this.dialogRef = this.dialog.open(CredentialDialog, config);

            this.dialogRef.afterClosed().subscribe(dialogResult => {
              if (dialogResult === 'yes') {
                this.router.navigate(['/login']);
              }
              this.dialogRef = null;
            });
          } else {
            this.openSnackBar(this.languageService.instant('Could not change your email'), 'FAILURE');
          }
        },
        error => {
          this.openSnackBar(this.languageService.instant('Could not change your email'), 'FAILURE');
          console.error(error);
      });
  }

  /**
   * changes the user password
   * @param  {string} newPassword the new password to be used
   * @return {[type]}             [description]
   */
  changePassword(newPassword: string) {
    this.service.changePassword(newPassword)
      .subscribe(result => {
        if (result === true) {
          const config: MdDialogConfig = {
            data: {
              credential: 'password'
            },
            disableClose: true,
            width: '400px'
          };
          this.dialogRef = this.dialog.open(CredentialDialog, config);

          this.dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult === 'yes') {
              this.router.navigate(['/login']);
            }
            this.dialogRef = null;
          });
        } else {
          this.openSnackBar(this.languageService.instant('Could not change your password'), 'FAILURE');
        }
      },
      error => {
        this.openSnackBar(this.languageService.instant('Could not change your password'), 'FAILURE');
        // console.error(error);
    });
  }

  /**
   * requests a referral link
   * @param  {string} role The role of the user that is to be referred
   */
  requestReferral(role: string) {
    this.service.getReferral(role)
        .subscribe(result => {
          const config: MdDialogConfig = {
            data: {
              referralURL: result,
              role: role,
            }
          };
          this.dialogRef = this.dialog.open(ReferDialog, config);
        });
  }

  /**
   * Gets a list of users
   */
  getUsers() {
    this.user = this.service.getUser();

    this.userListSub = this.service.getAllUsers().subscribe(users => {
      this.userList = users; // Subscribe and get user from the authService
    });
  }

  /**
   * Deletes the user of a given id
   * @param  {string} id the id of the user that is to be deleted
   */
  deleteUser(id: string) {
    if (id === this.user._id) {
      this.openSnackBar(this.languageService.instant('Can\'t delete this user'), 'FAILURE');
    } else {
      this.service.deleteAccount(id)
          .subscribe(result => {
              if (result === true) {
                  this.getUsers();
                  this.openSnackBar(this.languageService.instant('User has been deleted'), 'SUCCESS');
                  // this.router.navigate(['/login']);
              } else {
                  console.error('Error - your account might not have been deleted');
              }
          });
        }
  }


  /**
   * Opens a snackbar with the given message and action message
   * @param  {string} message The message that is to be displayed
   * @param  {string} action  the action message that is to be displayed
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  /**
   * Opens a delete user dialog and prompts the user if he or she wants to delete said user
   * @param  {string} id the id of the user that is to be deleted
   */
  openDialog(id: string) {
    if (id === this.user._id) {
      this.openSnackBar(this.languageService.instant('Can\'t delete current user'), 'FAILURE');
    } else {
      this.dialogRef = this.dialog.open(DeleteDialog, {
        disableClose: false
      });

      this.dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.deleteUser(id);
        }
        this.dialogRef = null;
      });
    }
  }


}



/**
 * DeleteDialog
 *
 * Holds dialog logic
 */
@Component({
  selector: 'delete-acccount-dialog',
  template: `
  <h1 md-dialog-title align="center">{{ 'Are you sure you want to delete this account?' | translate }}</h1>
  <div md-dialog-content align="center">
    {{ 'The account will be deleted! This action is permanent!' | translate }}
  </div>
  <div md-dialog-actions align="center">
    <button md-raised-button color="warn" (click)="dialogRef.close('yes')">{{ 'Delete' | translate }}</button>
    <button md-raised-button md-dialog-close color="primary" class="btn btn-default">{{ 'Cancel' | translate }}</button>
  </div>
  `,
  styleUrls: ['./admin-settings.component.scss']
})
export class DeleteDialog {
  constructor(public dialogRef: MdDialogRef<DeleteDialog>) { }
}

/**
 * ReferDialog
 *
 * Holds dialog logic
 */
@Component({
  selector: 'refer-acccount-dialog',
  template: `
  <h1 md-dialog-title>{{ 'Refer a userType' | translate : [data.role] }}</h1>
  <div md-dialog-content>
    <p>{{ 'A referral link is only active for two weeks' | translate }}</p>
    <md-input-container class="referralField">
      <input class="referralField"
        mdInput placeholder="{{ 'Referral link' | translate }}"
        value="{{data.referralURL}}"
        [(ngModel)] = "text">
    </md-input-container>
    <button md-raised-button
      class="btn btn-default"
      [class.btn-success] = 'isCopied'
      type="button"
      ngxClipboard
      [cbContent] = 'text'
      (cbOnSuccess) = 'isCopied = true'>
        {{ 'Copy' | translate }}
        <md-icon>content_copy</md-icon>
    </button>
  </div>
  <div md-dialog-actions align="center">
    <button md-raised-button md-dialog-close color="primary">{{ 'Okay' | translate }}</button>
  </div>
  `,
  styleUrls: ['./admin-settings.component.scss']
})
export class ReferDialog {
  public isCopied = false;
  public text = '';
  constructor(public dialogRef: MdDialogRef<ReferDialog>, @Inject(MD_DIALOG_DATA) public data: any) {
    this.setCopyBox();
  }

  /**
   * Sets the text of the box to be that of the referral link
   */
  setCopyBox() {
    this.text = this.data.referralURL;
  }
}

/**
 * ReferDialog
 *
 * Holds dialog logic
 */
@Component({
  selector: 'credential-changed-dialog',
  template: `
  <h1 md-dialog-title align="center">{{ 'Success' | translate }}</h1>
  <div md-dialog-content align="center">
    <p>{{ data.credential === 'password' ?
      ('You have now changed your password' | translate) : ('You have now changed your email' | translate)}}</p>
    <p>{{ 'You will now be logged out' | translate }}</p>
  </div>
  <div md-dialog-actions align="center">
    <button md-raised-button color="primary"
    (click)="dialogRef.close('yes')">{{ 'Okay' | translate }}</button>
  </div>
  `,
  styleUrls: ['./admin-settings.component.scss']
})
export class CredentialDialog {
  constructor(public dialogRef: MdDialogRef<CredentialDialog>, @Inject(MD_DIALOG_DATA) public data: any) { }
}
