import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { slideDownFadeInAnimation } from '../../animations';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { User } from '../../_models/user';

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
  error: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService) {
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

  submitForm(user: User) {
    this.loading = true;
    // console.log(user);

    this.loading = true;
    const sub = this.authenticationService.login(user.email, user.password)
        .subscribe(result => {
          sub.unsubscribe();
          // console.log("Got response!")
          if (result === true) {
              this.router.navigate(['/admin']);
          } else {
              this.error = 'Email or password is incorrect';
              this.loading = false;
          }
        },
        error => {
          sub.unsubscribe();
          user.password = '';
          this.error = 'Email or password is incorrect';
          this.loading = false;
        }
      );
  }
}
