import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import * as firebase from 'firebase';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private navCtrl: NavController,
    private user: UserService,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('initialize app');
      this.storage.create();
      // Initializing Firebase
      firebase.initializeApp(environment.config);
      firebase.auth().onAuthStateChanged((user) => {
        console.log('Auth State Changed');
        if (user) {
          let data = {
            id: firebase.auth().currentUser.uid
          }
          this.storage.set('userData', data);
        } else {
          this.storage.set('userData', '');
        }
      });
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    this.storage.get('userData').then((data) => {
      console.log('Check Login Status', data);
      if (data !== '') {
        this.navCtrl.navigateRoot(['/home']);
      } else {
        this.navCtrl.navigateRoot(['/login']);
      }
    });
  }
}
