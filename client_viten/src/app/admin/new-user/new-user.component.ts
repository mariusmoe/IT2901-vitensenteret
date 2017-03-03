import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { slideInDownAnimation } from '../../animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { User } from '../../_models/user';
import { MdSnackBar } from '@angular/material';
import { TranslateService } from '../../_services/translate.service';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  newUserForm: FormGroup;
  loading = false;
  error: string;
  param: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public snackBar: MdSnackBar,
    public languageService: TranslateService,
    private authenticationService: AuthenticationService) {
      this.newUserForm = fb.group({
      'email': [null, Validators.required],
      'password': [null, Validators.required],
      'passwordconfirm': [null, Validators.required]
    });
   }

  ngOnInit() {
    localStorage.removeItem('token');
    this.param = this.route.snapshot.params['refLink'];
  }

  submitForm(form: {email: string, password: string, passwordconfirm: string}): void {
    this.loading = true;
    console.log(form);

    this.loading = true;
    const sub = this.authenticationService.registerUser(form.email, form.password, this.param)
        .subscribe(result => {
          sub.unsubscribe();
          // console.log("Got response!")
          if (result === true) {
              this.router.navigate(['/login']);
          } else {
              this.error = 'Something went wrong';
              this.loading = false;
          }
        },
        error => {
          sub.unsubscribe();
          this.openSnackBar(this.languageService.instant('Could not register account'), 'FAILURE');
          this.error = 'Something went wrong';
          this.loading = false;
        }
      );

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
