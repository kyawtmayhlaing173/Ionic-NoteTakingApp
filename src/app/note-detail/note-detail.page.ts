import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import * as firebase from 'firebase';
import { PopoverComponent } from '../popover/popover.component';
import { Storage } from '@ionic/storage';
import { NotesService } from '../services/notes.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.page.html',
  styleUrls: ['./note-detail.page.scss'],
})
export class NoteDetailPage implements OnInit {

  note_id: any;
  noteDetail: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public popoverController: PopoverController,
    public storage: Storage,
    public user: UserService,
    public note: NotesService
  ) {
    this.note_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getNote();
  }

  ngOnInit() {
  }

  getNote() {
    firebase.firestore().collection('notes').doc(this.note_id).get().then((doc) => {
      let note = new NotesService();
      note.set_id(doc.id);
      note.set_title(doc.data().title);
      note.set_description(doc.data().description);
      let currentDate = doc.data().createdAt.toDate().toString();
      currentDate = currentDate.split('2021')[0]
      note.set_createdAt(currentDate);
      this.noteDetail.push(note);
      console.log(this.noteDetail);
    });
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
}
