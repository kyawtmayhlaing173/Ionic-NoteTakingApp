import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddFolderModalPageRoutingModule } from './add-folder-modal-routing.module';

import { AddFolderModalPage } from './add-folder-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddFolderModalPageRoutingModule
  ],
  declarations: [AddFolderModalPage]
})
export class AddFolderModalPageModule {}
