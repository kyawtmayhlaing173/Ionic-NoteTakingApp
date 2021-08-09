import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import * as firebase from 'firebase';
import { PopoverComponent } from '../popover/popover.component';
import { Storage } from '@ionic/storage';
import { NotesService } from '../services/notes.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  all_notes: any = [];
  username: any;

  constructor(
    private router: Router,
    public popoverController: PopoverController,
    public storage: Storage,
    public user: UserService
  ) {
    this.getAllNotes();
    this.getUserName();
  }

  segmentChanged(event) {
    console.log(event.detail.value);
  }

  getUserName() {
    this.user.getUserName().then((data) => {
      this.username = data;
    });
  }

  addNotes() {
    this.router.navigate(['add-note']);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'popover-css',
      event: ev,
      translucent: true
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  getAllNotes() {
    this.storage.get('userData').then((data) => {
      firebase.firestore().collection('notes')
        .where('createdBy', '==', data.id)
        .get().then((snapshot) => {
          snapshot.forEach((doc) => {
            let note = new NotesService();
            note.set_title(doc.data().title);
            note.set_description(doc.data().description);
            let currentDate = doc.data().createdAt.toDate().toString();
            currentDate = currentDate.split('2021')[0]
            console.log(currentDate);
            note.set_createdAt(currentDate);
            this.all_notes.push(note);
          });
        });
    });
  }
}
