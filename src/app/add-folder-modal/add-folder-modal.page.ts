import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-add-folder-modal',
  templateUrl: './add-folder-modal.page.html',
  styleUrls: ['./add-folder-modal.page.scss'],
})
export class AddFolderModalPage implements OnInit {

  all_folders = [];
  selectedFolder: any;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController
  ) {
    this.selectedFolder = this.navParams.get('folderName');
    console.log('Selected Folder is ', this.selectedFolder);
    this.getFolders();
  }

  ngOnInit() {
  }

  getFolders() {
    this.all_folders = [];
    firebase.firestore().collection('folders').get().then((snap) => {
      snap.forEach((doc) => {
        this.all_folders.push(doc.data().name);
      });
    });
  }

  radioGroupChange(event) {
    console.log(event.detail.value);
    this.modalController.dismiss(event.detail.value);
  }

}
