import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { NotesService } from '../services/notes.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AddFolderModalPage } from '../add-folder-modal/add-folder-modal.page';

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
  editorData: any = 'Hello World!';
  currentDate: any;
  saveBtnDisable: any = true;
  note_id: any;
  folderName: any;
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
    public modalController: ModalController,
    public alertController: AlertController
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
        this.folderName = doc.data().folder;
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
        description: this.editorData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: data.id,
        folder: this.folderName
      }).then((res) => {
        this.presentToast('Your note has been saved.');
        this.navCtrl.navigateRoot(['/home']);
      });
    });
  }

  updateNote() {
    let title = this.noteForm.value.titleControl;
    this.storage.get('userData').then((data) => {
      firebase.firestore().collection('notes').doc(this.note_id).update({
        title,
        description: this.editorData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: data.id,
        folder: this.folderName
      }).then(() => {
        this.presentToast('Your note has been successfully updated.');
        this.navCtrl.pop();
      });
    });
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
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

  async presentModal() {
    console.log('Present Modal', this.folderName);
    const modal = await this.modalController.create({
      component: AddFolderModalPage,
      cssClass: 'add-folder-modal-css',
      backdropDismiss: true,
      keyboardClose: false,
      componentProps: {
        folderName: this.folderName
      }
    });
    await modal.present();
    modal.onDidDismiss().then((params) => {
      console.log('Modal is dismissed', params.data);
      this.folderName = params.data;
    });
  }

  deleteNote() {
    firebase.firestore().collection('notes').doc(this.note_id).delete().then(() => {
      this.presentToast('Successfully delete the note');
      this.navCtrl.pop();
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Are you sure?',
      message: 'Do you want to delete this note?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.deleteNote();
          }
        }
      ]
    });

    await alert.present();
  }
}
