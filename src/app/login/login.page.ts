import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  segment: any = 'login';
  public authForm: FormGroup;

  constructor(
    private user: UserService,
    private router: Router,
    public formBuilder: FormBuilder,
  ) {
    this.authForm = this.formBuilder.group({
      emailControl: new FormControl('', Validators.compose([
        Validators.required,
        // This is for the email validation
        Validators.pattern('^[A-Za-z0-9._!%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})$')
      ])),
      passwordControl: new FormControl('', Validators.compose([
        Validators.required,
        // Password must contain one uppercase letter, one lowercase letter and one digit
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9{};:=<>_+-^#$@!%*?&.\/()¶∆√π÷×~|%£©®™℅¢€\'\"„”—…·¡¿±÷°•`´¥]+$')
      ])),
      nameControl: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  ngOnInit() {
  }

  // Segment Changed
  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
    this.segment = ev.detail.value;
    this.authForm.reset();
  }

  checkValidation(type) {
    console.log('Check Validation' + this.authForm.errors);
    if (this.authForm.valid !== null) {
      console.log('valid');
      if (type === 'signup') {
        this.signUp(
          this.authForm.value.emailControl,
          this.authForm.value.passwordControl,
          this.authForm.value.nameControl
        );
      } else {
        this.logIn(
          this.authForm.value.emailControl,
          this.authForm.value.passwordControl
        );
      }
    } else {
      console.log('Not Valid');
    }
  }

  // Sign Up with email and password
  signUp(email, password, name) {
    this.user.signUp(email, password, name).then((response) => {
      if (response) {
        console.log('Success');
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    });
  }

  logIn(email, password) {
    console.log('Login');
    this.user.signIn(email, password).then((response) => {
      if (response) {
        this.router.navigateByUrl('/home', { replaceUrl: true });
      }
    });
  }

}
