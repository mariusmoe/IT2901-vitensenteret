import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { User } from '../../_models/index';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../../_services/authentication.service';
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
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public languageService: TranslateService) {
      this.selectedLanguage = languageService.getCurrentLang();
      this.user = this.service.getUser();
      if (this.user.role === 'admin') {
        this.getUsers(); // TODO: if user ISN'T superadmin, do not do execute getUsers()
      }
    }



  ngOnInit() {
  }

  ngOnDestroy() {
    // this.emailSub.unsubscribe();
  }


  setSelectedLanguage() {
    this.languageService.use(this.selectedLanguage);
  }

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
              // console.log('result: ' + dialogResult);
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
            // console.log('result: ' + dialogResult);
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
        console.error(error);
    });
  }

  requestReferral(role) {
    this.service.getReferral(role)
        .subscribe(result => {
          // console.log(result);
          const config: MdDialogConfig = {
            data: {
              referralURL: result,
              role: role,
            }
          };
          this.dialogRef = this.dialog.open(ReferDialog, config);
        });
  }

  getUsers() {
    this.user = this.service.getUser();

    this.userListSub = this.service.getAllUsers().subscribe(users => {
      this.userList = users; // Subscribe and get user from the authService
      // console.log(this.userList);
    });
  }

  setSelected(selected: number) {
    this.selectedRow = selected;
  }

  /**
   * Delete the current user
   *
   * Delete the user that is currently loged in
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  /**
   * Opens a dialog
   *
   * Promts the user to delete the account or not
   */
  openDialog(id: string) {
    if (id === this.user._id) {
      this.openSnackBar(this.languageService.instant('Can\'t delete current user'), 'FAILURE');
    } else {
      this.dialogRef = this.dialog.open(DeleteDialog, {
        disableClose: false
      });

      this.dialogRef.afterClosed().subscribe(result => {
        // console.log('result: ' + result);
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
  <h1>{{ 'Are you sure you want to delete this account?' | translate }}</h1>
  <br>
  <p>{{ 'The account will be deleted! This action is permanent!' | translate }}</p>
  <md-dialog-actions>
    <button md-raised-button color="warn"  (click)="dialogRef.close('yes')">{{ 'Delete' | translate }}</button>
    <button md-raised-button color="primary"  md-dialog-close>{{ 'Cancel' | translate }}</button>
  </md-dialog-actions>
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
  <h1>{{ 'Refer one userType' | translate:[data.role] }}</h1>
  <br>
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
  <md-dialog-actions>
    <button md-raised-button color="primary"  md-dialog-close>{{ 'Okay' | translate }}</button>
  </md-dialog-actions>
  `,
  styleUrls: ['./admin-settings.component.scss']
})
export class ReferDialog {
  public isCopied = false;
  public text = '';
  constructor(public dialogRef: MdDialogRef<ReferDialog>, @Inject(MD_DIALOG_DATA) public data: any) {
    this.setCopyBox(); }

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
  <h1>{{ 'Success' | translate }}</h1>
  <br>

  <p>{{ data.credential === 'password' ?
    ('You have now changed your password' | translate) : ('You have now changed your email' | translate)}}</p>
  <p>{{ 'You will now be logged out' | translate }}</p>
  <md-dialog-actions>
    <button md-raised-button color="primary" (click)="dialogRef.close('yes')">{{ 'Okay' | translate }}</button>
  </md-dialog-actions>
  `,
  styleUrls: ['./admin-settings.component.scss']
})
export class CredentialDialog {
  constructor(public dialogRef: MdDialogRef<CredentialDialog>, @Inject(MD_DIALOG_DATA) public data: any) { }
}
