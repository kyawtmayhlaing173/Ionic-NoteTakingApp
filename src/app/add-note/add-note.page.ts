import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { NotesService } from '../services/notes.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.page.html',
  styleUrls: ['./add-note.page.scss'],
})
export class AddNotePage implements OnInit {

  public noteForm: FormGroup;
  public Editor = ClassicEditor;
  public editorConfiguration = {
    toolbar: ['heading', '|', 'bold', 'italic',
      'bulletedList', 'numberedList', 'undo', 'redo'],
    alignment: {
      options: ['left', 'right']
    }
  };
  editorData: any;
  currentDate: any;
  saveBtnDisable: any = true;
  note_id: any;
  folderName: any;
  description: any;
  customPopoverOptions: any = {
    header: 'Font Size',
    message: 'Please select your font size'
  };

  constructor(
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public navCtrl: NavController,
    public storage: Storage,
    private activatedRoute: ActivatedRoute,
    private note: NotesService,
    private zone: NgZone,
  ) {
    this.noteForm = this.formBuilder.group({
      titleControl: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

    this.currentDate = new Date().toString();
    this.currentDate = this.currentDate.split('2021')[0] + ' 2021';
    this.note_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.folderName = this.activatedRoute.snapshot.paramMap.get('folderName');
    console.log(this.note_id, this.folderName);
    if (this.note_id) {
      this.getNote();
    }
  }

  ngOnInit() {
  }

  getNote() {
    console.log('Get Note');
    firebase.firestore().collection('notes').doc(this.note_id).get().then((doc) => {
      console.log(doc.data());
      this.zone.run(() => {
        this.noteForm.setValue({
          titleControl: doc.data().title,
        });
        this.editorData = doc.data().description;
        this.editorData = "<ul><li><i><strong>Wonderful World</strong></i></li></ul>"
      });
    });
    this.saveBtnDisable = false;
  }

  saveNote() {
    if (this.note_id) {
      this.updateNote();
    } else {
      this.createNewNote();
    }
  }

  createNewNote() {
    let title = this.noteForm.value.titleControl;
    this.storage.get('userData').then((data) => {
      firebase.firestore().collection('notes').add({
        title,
        description: this.description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: data.id,
        folder: this.folderName
      }).then((res) => {
        this.presentToast();
        this.navCtrl.pop();
      });
    });
  }

  updateNote() {
    let title = this.noteForm.value.titleControl;
    this.storage.get('userData').then((data) => {
      firebase.firestore().collection('notes').doc(this.note_id).update({
        title,
        description: this.description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: data.id,
        folder: this.folderName
      }).then(() => {
        this.presentToast();
        this.navCtrl.pop();
      });
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your note has been saved.',
      duration: 2000
    });
    toast.present();
  }

  searchChanged(val) {
    console.log('Search has changed', val.length);
    if (val.length > 0) {
      this.saveBtnDisable = false;
    } else {
      this.saveBtnDisable = true;
    }
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.description = data;
    console.log('Text on Change', data);
  }
}
