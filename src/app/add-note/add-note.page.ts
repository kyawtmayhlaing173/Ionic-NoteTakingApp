import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.page.html',
  styleUrls: ['./add-note.page.scss'],
})
export class AddNotePage implements OnInit {

  public noteForm: FormGroup;
  currentDate: any;
  fontSize: any = 17;
  showFontSelector = false;
  showColorSelector = false;
  fontSelected = false;
  colorSelected = false;
  textColor: any = "#000000";

  customPopoverOptions: any = {
    header: 'Font Size',
    message: 'Please select your font size'
  };

  constructor(
    public formBuilder: FormBuilder,
    public toastController: ToastController,
    public navCtrl: NavController,
    public storage: Storage
  ) {
    this.noteForm = this.formBuilder.group({
      titleControl: new FormControl('', Validators.compose([
        Validators.required
      ])),
      bodyControl: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

    this.currentDate = new Date().toString();
    this.currentDate = this.currentDate.split('2021')[0] + ' 2021';
  }

  ngOnInit() {
  }

  saveNote() {
    let title = this.noteForm.value.titleControl;
    let description = this.noteForm.value.bodyControl;
    this.storage.get('userData').then((data) => {
      firebase.firestore().collection('notes').add({
        title,
        description,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: data.id
      }).then((res) => {
        this.navCtrl.pop();
        this.presentToast();
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

  fontChanged(event) {
    switch (event.detail.value) {
      case "medium": this.fontSize = 14; break;
      case "small": this.fontSize = 11; break;
      case "large": this.fontSize = 17; break;
      default: this.fontSize = 14;
    }
  }

  selectFontEditor() {
    this.fontSelected = true;
    this.colorSelected = !this.fontSelected;
    this.showFontSelector = true;
    this.showColorSelector = !this.showFontSelector;
  }

  selectColorEditor() {
    this.colorSelected = true;
    this.fontSelected = !this.colorSelected;
    this.showColorSelector = true;
    this.showFontSelector = !this.showColorSelector;
  }

  setColor(color) {
    switch (color) {
      case 'red': this.textColor = "#FF4848"; break;
      case 'green': this.textColor = "#28FFBF"; break;
      case 'blue': this.textColor = "#B5EAEA"; break;
      case 'purple': this.textColor = "#7C83FD"; break;
    }
  }
}
