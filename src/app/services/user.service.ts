import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private navCtrl: NavController,
    public storage: Storage
  ) { }

  signIn(email, password) {
    return new Promise(resolve => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(async (user) => {
        resolve(true);
      });
    });
  }

  signUp(email, password, name) {
    return new Promise(resolve => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(async (user) => {
        firebase.firestore().collection('user').doc(await user.user.uid).set({
          email,
          name,
          userID: await user.user.uid
        }).then(() => {
          resolve(true);
        });
      });
    });
  }

  checkCurrentUser() {
    return new Promise(resolve => {
      if (firebase.auth().currentUser) {
        resolve(true)
      } else {
        resolve(false)
      }
    });
  }

  logOut() {
    return new Promise(resolve => {
      firebase.auth().signOut();
      this.navCtrl.navigateRoot(['/login']);
    });
  }

  getUserName() {
    return new Promise(resolve => {
      this.storage.get('userData').then((data) => {
        firebase.firestore().collection('user').doc(data.id).get().then((doc) => {
          console.log(doc.data().name);
          resolve(doc.data().name);
        });
      });
    });
  }
}
