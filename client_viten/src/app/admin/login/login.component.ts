import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { slideDownFadeInAnimation } from '../../animations';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { TranslateService } from '../../_services/translate.service';
import { User } from '../../_models/user';
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [ slideDownFadeInAnimation ]
})
export class LoginComponent implements OnInit, OnDestroy {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';


  loginForm: FormGroup;
  loading = false;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    private authenticationService: AuthenticationService,
    public languageService: TranslateService) {
      this.loginForm = fb.group({
      'email': [null, Validators.required],
      'password': [null, Validators.required]
    });
   }

  ngOnInit() {
    // sets background according to the noWrapper class (see app.component.scss)
    document.querySelector('html').classList.add('noWrapper');
  }
  ngOnDestroy() {
    document.querySelector('html').classList.remove('noWrapper');
  }

  /**
   * submits the login form
   * @param  {User}   user the user that is to be logged in
   */
  submitForm(user: User) {
    this.loading = true;

    this.loading = true;
    const sub = this.authenticationService.login(user.email, user.password)
        .subscribe(result => {
          sub.unsubscribe();
          if (result === true) {
              this.router.navigate(['/admin']);
          } else {
              this.loading = false;
              this.openSnackBar(this.languageService.instant('There was an issue connecting to the server'), 'OK');
          }
        },
        error => {
          sub.unsubscribe();
          user.password = '';
          this.loading = false;
          if (error.status && (error.status === 401 || error.status === 400)) {
            this.openSnackBar(this.languageService.instant('Email or password is incorrect'), 'OK');
          } else {
            this.openSnackBar(this.languageService.instant('There was an issue connecting to the server'), 'OK');
          }
        }
      );
  }

  /**
   * Open the user manual in a new window
   */
  openUserManual() {
    window.open('/assets/manuals/manual-usermanual-2.pdf', '_blank');
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
}
