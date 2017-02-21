import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { User } from '../../_models/index';
import { Router } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';
import { AuthenticationService } from '../../_services/authentication.service';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  private userSub;
  private user: User;
  private email: string = "";

  public  dialogRef: MdDialogRef<DeleteDialog>;

  constructor(
    private router: Router,
    private service: AuthenticationService,
    public dialog: MdDialog) {
      this.userSub = this.service.getCurrentUserObservable().subscribe(user => {
        this.user = user; // Subscribe and get user from the authService
      });
    }



  ngOnInit() {
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
  <h1>Are you sure you want to delete this account?</h1>
  <br>
  <p>Everything will be deleted and unrecoverable!</p>
  <md-dialog-actions>
    <button md-raised-button color="warn"  (click)="dialogRef.close('yes')">Yes, Kill it</button>
    <button md-raised-button color="primary"  md-dialog-close>No I did not mean this!</button>
  </md-dialog-actions>
  `,
  styleUrls: ['./admin-settings.component.scss']
})
export class DeleteDialog {
  constructor(public dialogRef: MdDialogRef<DeleteDialog>) { }
}
