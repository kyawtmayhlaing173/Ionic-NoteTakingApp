import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-add-folder-modal',
  templateUrl: './add-folder-modal.page.html',
  styleUrls: ['./add-folder-modal.page.scss'],
})
export class AddFolderModalPage implements OnInit {

  all_folders = [];
  selectedFolder: any;
  noFolder: any;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    public storage: Storage,
  ) {
    this.selectedFolder = this.navParams.get('folderName');
    console.log('Selected Folder is ', this.selectedFolder);
    this.getFolders();
  }

  ngOnInit() {
  }

  getFolders() {
    this.all_folders = [];
    this.storage.get('userData').then((data) => {
      firebase.firestore().collection('folders').where('createdBy', '==', data.id).get().then((snap) => {
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

  radioGroupChange(event) {
    console.log(event.detail.value);
    this.modalController.dismiss(event.detail.value);
  }

}
