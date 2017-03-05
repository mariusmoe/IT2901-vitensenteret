import { Component, OnInit, HostBinding } from '@angular/core';
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
export class LoginComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';
  @HostBinding('style.position')  position = 'relative';


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
  }

  submitForm(user: User) {
    this.loading = true;
    console.log(user);

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
