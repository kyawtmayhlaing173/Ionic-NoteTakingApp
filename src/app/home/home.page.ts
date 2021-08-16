import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, AlertController, LoadingController } from '@ionic/angular';
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
  segment: any = 'notes';
  all_folders: any = [];
  noResult = false;
  noFolder = false;

  constructor(
    private router: Router,
    public popoverController: PopoverController,
    public storage: Storage,
    public user: UserService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public zone: NgZone
  ) { }

  loadInitialData() {
    this.getAllNotes();
    this.getUserName();
    this.getFolders();
  }

  ionViewWillEnter() {
    this.presentLoading();
    this.loadInitialData();
  }

  doRefresh(event) {
    this.loadInitialData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  segmentChanged(event) {
    console.log(event.detail.value);
    this.segment = event.detail.value;
  }

  getUserName() {
    this.user.getUserName().then((data) => {
      this.username = data;
    });
  }

  addNotes() {
    let note = {
      id: ''
    }
    this.router.navigate(['/add-note', note])
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
    console.log('Get All Notes');
    this.zone.run(() => {
      this.storage.get('userData').then((data) => {
        this.all_notes = [];
        firebase.firestore().collection('notes')
          .where('createdBy', '==', data.id)
          .get().then((snapshot) => {
            console.log(data.id)
            if (snapshot.size > 0) {
              snapshot.forEach((doc) => {
                let note = new NotesService();
                note.set_id(doc.id);
                note.set_title(doc.data().title.substring(0, 40));
                note.set_description(doc.data().description.substring(0, 40));
                note.set_folder(doc.data().folder);
                let currentDate = doc.data().createdAt.toDate().toString();
                currentDate = currentDate.split('2021')[0]
                console.log(currentDate);
                note.set_createdAt(currentDate);
                this.all_notes.push(note);
                console.log(this.all_notes);
              });
              this.noResult = false;
            } else {
              this.noResult = true;
            }
          });
      });
    });
  }

  goToNoteDetail(note_id) {
    let note = {
      id: note_id
    }
    this.router.navigate(['/add-note', note])
  }

  getFolders() {
    this.all_folders = [];
    this.storage.get('userData').then((data) => {
      firebase.firestore().collection('folders')
        .where('createdBy', '==', data.id)
        .get().then((snap) => {
          if (snap.size > 0) {
            snap.forEach((doc) => {
              this.all_folders.push(doc.data().name);
            });
            this.noFolder = false;
          } else {
            this.noFolder = true;
          }
        });
    });
  }

  async showPrompt() {
    let prompt = await this.alertCtrl.create({
      message: "Enter Folder Name",
      mode: "ios",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked', data.title);
            this.addFolder(data.title);
          }
        }
      ]
    });
    await prompt.present();

  }

  addFolder(folderName) {
    this.storage.get('userData').then((data) => {
      firebase.firestore().collection('folders').add({
        name: folderName,
        createdBy: data.id
      }).then(() => {
        console.log('Success');
        this.getFolders();
      });
    });
  }

  getNotesByFolder(folderName) {
    let folder = {
      'name': folderName
    }
    this.router.navigate(['/note-list', folder]);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

}
