import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

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
    public toastController: ToastController
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
        Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
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
    if (this.segment === 'login') {
      this.authForm.controls.nameControl.setValue('abc');
    }
    if (this.authForm.valid) {
      console.log('valid');
      if (this.segment === 'signup') {
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
    }
  }

  // Sign Up with email and password
  signUp(email, password, name) {
    this.user.signUp(email, password, name).then((response) => {
      console.log('Response', response['status']);
      if (response['status']) {
        console.log('Success');
        this.presentToast('Successfully Signup');
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        this.presentToast(response['error']);
      }
    });
  }

  logIn(email, password) {
    console.log('Login');
    this.user.logIn(email, password).then((response) => {
      if (response['status']) {
        this.presentToast('Successfully Login');
        this.router.navigateByUrl('/home', { replaceUrl: true });
      } else {
        this.presentToast(response['error']);
      }
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
