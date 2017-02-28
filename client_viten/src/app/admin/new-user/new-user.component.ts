import { Component, OnInit, HostBinding } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { slideInDownAnimation } from '../../animations';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service';
import { User } from '../../_models/user';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  newUserForm: FormGroup;
  loading = false;
  error: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService) {
      this.newUserForm = fb.group({
      'email': [null, Validators.required],
      'password': [null, Validators.required],
      'passwordconfirm': [null, Validators.required]
    });
   }

  ngOnInit() {
  }

  submitForm(form: {email: string, password: string, passwordconfirm: string}): void {
    this.loading = true;
    console.log(form);

    if (form.password === form.passwordconfirm) {
      console.log('success');
    }
    else{
      console.log('failure');
    }

  }

}
