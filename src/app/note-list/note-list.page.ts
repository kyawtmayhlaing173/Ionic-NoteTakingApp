import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase';
import { NotesService } from '../services/notes.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.page.html',
  styleUrls: ['./note-list.page.scss'],
})
export class NoteListPage implements OnInit {

  all_notes: any = [];
  folderName: any;
  noResult = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storage: Storage
  ) { }

  ionViewDidEnter() {
    this.folderName = this.activatedRoute.snapshot.paramMap.get('name');
    console.log(this.folderName);
    this.getNoteByFolderName(this.folderName);
  }

  doRefresh(event) {
    this.getNoteByFolderName(this.folderName);
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  ngOnInit() {
  }

  getNoteByFolderName(folderName) {
    this.all_notes = [];
    this.storage.get('userData').then((data) => {
      firebase.firestore().collection('notes')
        .where('folder', '==', this.folderName)
        .where('createdBy', '==', data.id)
        .get().then((snapshot) => {
          console.log(data.id)
          if (snapshot.size > 0) {
            snapshot.forEach((doc) => {
              let note = new NotesService();
              note.set_id(doc.id);
              note.set_title(doc.data().title);
              note.set_description(doc.data().description.substring(0, 40));
              note.set_folder(doc.data().folder);
              let currentDate = doc.data().createdAt.toDate().toString();
              currentDate = currentDate.split('2021')[0]
              console.log(currentDate);
              note.set_createdAt(currentDate);
              this.all_notes.push(note);
              console.log(this.all_notes);
            });
          } else {
            this.noResult = true;
          }
        });
    });
  }

  addNotes(note_id) {
    let note = {
      id: '',
      folderName: this.folderName
    }
    this.router.navigate(['/add-note', note])
  }

  goToNoteDetail(note_id) {
    let note = {
      id: note_id,
      folderName: this.folderName
    }
    this.router.navigate(['/add-note', note])
  }

}
